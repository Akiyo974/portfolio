import { describe, it, expect } from 'vitest';
import { labComponents, labExperiments } from '../data/lab';
import { labIndexComponents, labIndexExperiments } from '../data/labIndex';

// Le sommaire de l'accueil doit rester aligné sur les fiches du Lab (mêmes ids, noms et notes, même ordre)
describe('labIndex', () => {
  it('matches the Lab components', () => {
    expect(labIndexComponents.map(({ id, name, score }) => ({ id, name, score }))).toEqual(
      labComponents.map(({ id, name, score }) => ({ id, name, score }))
    );
  });

  it('matches the Lab experiments', () => {
    expect(labIndexExperiments.map(({ id, name }) => ({ id, name }))).toEqual(
      labExperiments.map(({ id, title }) => ({ id, name: title }))
    );
  });
});
