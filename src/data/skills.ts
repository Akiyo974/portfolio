export interface SkillCategory {
  title: string;
  titleEn: string;
  skills: string[];
}

// Compétences organisées par catégories (source unique : section À propos + assistant)
export const skillCategories: Record<string, SkillCategory> = {
  development: {
    title: 'Développement',
    titleEn: 'Development',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'PHP', 'C#',
             'SQL', 'MySQL', 'PostgreSQL', 'GraphQL', 'REST API']
  },
  aiData: {
    title: 'IA & Data',
    titleEn: 'AI & Data',
    skills: ['OpenAI API', 'LangChain', 'RAG', 'Vector Databases', 'Machine Learning',
             'Prompt Engineering', 'AI Agents', 'Data Analysis', 'Embeddings', 'LLM Integration']
  },
  erpEnterprise: {
    title: 'ERP & Systèmes d\'entreprise',
    titleEn: 'ERP & Enterprise Systems',
    skills: ['Microsoft Dynamics NAV', 'Power Apps', 'Power Automate', 'Power BI',
             'ERP Integration', 'Data Synchronization', 'Business Process Automation',
             'Microsoft 365', 'SharePoint']
  },
  cloudDevops: {
    title: 'Cloud & DevOps',
    titleEn: 'Cloud & DevOps',
    skills: ['Microsoft Azure', 'Azure App Services', 'Azure Functions', 'Azure Storage',
             'Azure AI Services', 'DigitalOcean', 'Linux Administration', 'Nginx', 'Docker',
             'CI/CD', 'GitHub Actions', 'Cloudflare', 'DNS Management', 'SSL/TLS']
  },
  observability: {
    title: 'Observabilité',
    titleEn: 'Observability',
    skills: ['New Relic', 'Synthetic Monitoring', 'APM', 'Alerting', 'Performance Monitoring', 'Log Analysis']
  },
  automation: {
    title: 'Automatisation',
    titleEn: 'Automation',
    skills: ['n8n', 'Python Automation', 'API Integration', 'Workflow Automation', 'ETL Pipelines', 'Scripting']
  }
};
