<?php
/**
 * Classement du jeu des étoiles — sans base de données.
 *
 * Stockage : fichiers JSON dans api/data/ (accès web interdit par .htaccess).
 * Anti-triche minimal : jeton signé émis au début de la partie, à usage unique,
 * durée de jeu réelle exigée, score plafonné, limite d'envois par IP.
 *
 *   GET  api/leaderboard.php           -> { entries: [...] }  (top 10)
 *   POST api/leaderboard.php?action=start  -> { token }
 *   POST api/leaderboard.php?action=submit  { nickname, score, token } -> { entries, rank }
 */

declare(strict_types=1);

const GAME_SECONDS   = 20;    // durée d'une partie (doit correspondre au front)
const MAX_SCORE      = 400;   // score maximal plausible
const MAX_ENTRIES    = 100;   // scores conservés
const TOP_SIZE       = 10;    // scores renvoyés
const TOKEN_TTL      = 600;   // validité d'un jeton (s)
const RATE_LIMIT     = 8;     // envois max par IP...
const RATE_WINDOW    = 600;   // ...sur cette fenêtre (s)

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

// Données hors du dossier web si possible (ex. /home/compte/cd-leaderboard-data),
// pour survivre aux redéploiements de public_html ; sinon api/data protégé.
$outside = dirname(__DIR__, 2) . '/cd-leaderboard-data';
if (is_dir($outside) || (@is_writable(dirname($outside)) && @mkdir($outside, 0750, true))) {
    $dataDir = $outside;
} else {
    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0750, true);
    }
}
if (!file_exists($dataDir . '/.htaccess')) {
    @file_put_contents(
        $dataDir . '/.htaccess',
        "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n"
    );
}

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Lecture/écriture atomique d'un fichier JSON sous verrou. */
function withJson(string $file, callable $fn, $default = [])
{
    $fh = fopen($file, 'c+');
    if (!$fh) {
        respond(500, ['error' => 'storage']);
    }
    flock($fh, LOCK_EX);
    $raw = stream_get_contents($fh);
    $data = $raw ? json_decode($raw, true) : null;
    if (!is_array($data)) {
        $data = $default;
    }
    [$result, $next] = $fn($data);
    if ($next !== null) {
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($next, JSON_UNESCAPED_UNICODE));
        fflush($fh);
    }
    flock($fh, LOCK_UN);
    fclose($fh);
    return $result;
}

function secret(string $dataDir): string
{
    $file = $dataDir . '/secret.key';
    if (!file_exists($file)) {
        @file_put_contents($file, bin2hex(random_bytes(32)));
    }
    return (string) file_get_contents($file);
}

/**
 * IP réelle du visiteur. Derrière Cloudflare, REMOTE_ADDR est l'IP du proxy : on lit alors
 * CF-Connecting-IP, mais seulement si la requête vient vraiment d'une plage Cloudflare
 * (sinon l'en-tête pourrait être forgé pour contourner la limite de fréquence).
 */
function clientIp(): string
{
    $remote = $_SERVER['REMOTE_ADDR'] ?? '';
    $forwarded = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
    if ($forwarded === '' || !filter_var($forwarded, FILTER_VALIDATE_IP)) {
        return $remote;
    }
    // https://www.cloudflare.com/ips/
    $ranges = [
        '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18',
        '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17',
        '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
        '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32',
        '2a06:98c0::/29', '2c0f:f248::/32',
    ];
    $ip = @inet_pton($remote);
    if ($ip === false) {
        return $remote;
    }
    foreach ($ranges as $range) {
        [$net, $bits] = explode('/', $range);
        $netBin = inet_pton($net);
        if (strlen($netBin) !== strlen($ip)) {
            continue;
        }
        $bytes = intdiv((int) $bits, 8);
        $rest = (int) $bits % 8;
        if (substr($ip, 0, $bytes) !== substr($netBin, 0, $bytes)) {
            continue;
        }
        if ($rest === 0 || ((ord($ip[$bytes]) ^ ord($netBin[$bytes])) >> (8 - $rest)) === 0) {
            return $forwarded;
        }
    }
    return $remote;
}

function top(array $scores): array
{
    usort($scores, fn($a, $b) => $b['score'] <=> $a['score'] ?: strcmp($a['created_at'], $b['created_at']));
    return array_slice($scores, 0, TOP_SIZE);
}

$scoresFile = $dataDir . '/scores.json';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

// --- Lecture du classement --------------------------------------------------
if ($method === 'GET') {
    $entries = withJson($scoresFile, fn($s) => [top($s), null]);
    respond(200, ['entries' => $entries]);
}

if ($method !== 'POST') {
    respond(405, ['error' => 'method']);
}

// Même origine uniquement
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== $host) {
    respond(403, ['error' => 'origin']);
}

$secret = secret($dataDir);

// --- Début de partie : jeton signé ----------------------------------------
if ($action === 'start') {
    $payload = time() . '.' . bin2hex(random_bytes(8));
    $sig = hash_hmac('sha256', $payload, $secret);
    respond(200, ['token' => $payload . '.' . $sig]);
}

// --- Envoi d'un score -------------------------------------------------------
if ($action === 'submit') {
    $body = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($body)) {
        respond(400, ['error' => 'body']);
    }

    $nickname = strtoupper(trim((string) ($body['nickname'] ?? '')));
    $score = $body['score'] ?? null;
    $token = (string) ($body['token'] ?? '');

    if (!preg_match('/^[A-Z]{3}$/', $nickname)) {
        respond(422, ['error' => 'nickname']);
    }
    if (!is_int($score) || $score < 0 || $score > MAX_SCORE) {
        respond(422, ['error' => 'score']);
    }

    // Vérification du jeton
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        respond(403, ['error' => 'token']);
    }
    [$issuedAt, $nonce, $sig] = $parts;
    if (!hash_equals(hash_hmac('sha256', $issuedAt . '.' . $nonce, $secret), $sig)) {
        respond(403, ['error' => 'token']);
    }
    $elapsed = time() - (int) $issuedAt;
    if ($elapsed < GAME_SECONDS - 2 || $elapsed > TOKEN_TTL) {
        respond(403, ['error' => 'timing']);
    }

    // Jeton à usage unique + limite par IP
    $ipHash = hash('sha256', clientIp() . $secret);
    $allowed = withJson($dataDir . '/guard.json', function ($g) use ($nonce, $ipHash) {
        $now = time();
        $g['used'] = array_filter($g['used'] ?? [], fn($t) => $t > $now - TOKEN_TTL);
        // Purge à chaque envoi : on ne garde, pour chaque IP, que les envois de la fenêtre en cours,
        // et on oublie les IP sans envoi récent (sinon le fichier grossit sans fin)
        $g['ips'] = array_filter(
            array_map(
                fn($list) => array_values(array_filter($list, fn($t) => $t > $now - RATE_WINDOW)),
                $g['ips'] ?? []
            ),
            fn($list) => !empty($list)
        );
        if (isset($g['used'][$nonce])) {
            return [false, null];
        }
        $hits = array_values(array_filter($g['ips'][$ipHash] ?? [], fn($t) => $t > $now - RATE_WINDOW));
        if (count($hits) >= RATE_LIMIT) {
            return [false, null];
        }
        $hits[] = $now;
        $g['ips'][$ipHash] = $hits;
        $g['used'][$nonce] = $now;
        return [true, $g];
    }, ['used' => [], 'ips' => []]);

    if (!$allowed) {
        respond(429, ['error' => 'rate']);
    }

    $result = withJson($scoresFile, function ($scores) use ($nickname, $score) {
        $scores[] = [
            'id' => bin2hex(random_bytes(6)),
            'nickname' => $nickname,
            'score' => $score,
            'created_at' => gmdate('c'),
        ];
        usort($scores, fn($a, $b) => $b['score'] <=> $a['score']);
        $scores = array_slice($scores, 0, MAX_ENTRIES);
        $rank = 1 + count(array_filter($scores, fn($s) => $s['score'] > $score));
        return [['entries' => top($scores), 'rank' => $rank], $scores];
    });

    respond(200, $result);
}

respond(400, ['error' => 'action']);
