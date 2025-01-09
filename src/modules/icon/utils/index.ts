import { Icon } from '../entity/icon.entity';
import { dynamicIcon, otherIcon } from '../const/icon';

export const getAllIcon = (): Icon[] => {
  return [...generateIcon(dynamicIcon, '1'), ...generateIcon(otherIcon, '0')];
};

export const generateIcon = (icons: any[], type: string): Icon[] => {
  return icons.map((icon) => {
    let id = Number(icon.value);
    if (isNaN(id)) {
      id = icon.value.split('|')[0]; // 有些icon的value是 'xxx|xxx' 这种形式，取前面的部分作为id
    }
    return {
      id,
      name: icon.label,
      type,
    };
  });
};
