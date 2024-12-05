import { Hero } from '../entity/hero.entity';
import {
  commemorate,
  core,
  halfCore,
  huang,
  jue,
  jueCore,
  material,
  normal,
  useful,
  xpCore,
  xpHalfCore,
} from '../const/hero';

export const getAllHero = (): Hero[] => {
  return [
    ...generateHero(jueCore, 10),
    ...generateHero(huang, 8),
    ...generateHero(core, 7),
    ...generateHero(halfCore, 6),
    ...generateHero(xpCore, 5),
    ...generateHero(xpHalfCore, 4),
    ...generateHero(jue, 3),
    ...generateHero(useful, 2),
    ...generateHero(normal, 1),
    ...generateHero(material, 0),
    ...generateHero(commemorate, 1),
  ];
};

export const generateHero = (heroes: any[], score: number): Hero[] => {
  return heroes.map((hero) => {
    return {
      heroId: hero.hero_id,
      name: hero.name,
      country: hero.country,
      score,
    };
  });
};
