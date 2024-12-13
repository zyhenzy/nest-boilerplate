import { AccountHero } from '../entity/accountHero';

export const delDuplication = (cardList: AccountHero[]) => {
  const list: AccountHero[] = [];
  cardList.forEach((card) => {
    const findIndex = list.findIndex((item) => {
      return item.heroId === card.heroId;
    });
    if (findIndex !== -1) {
      list[findIndex].advanceNum += card.advanceNum;
      if (list[findIndex].advanceNum > 5) {
        list[findIndex].advanceNum = 5;
      }
    } else {
      list.push(card);
    }
  });
  return list;
};
