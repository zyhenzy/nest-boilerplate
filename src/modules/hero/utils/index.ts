import { Hero } from '../entity/hero.entity';

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
