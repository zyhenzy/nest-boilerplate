/**
 * 睡眠函数
 * @param delayTime
 */
export const sleep = (delayTime = 1000) => {
  const realDelayTime = delayTime + Math.random() * 5000;
  return new Promise((resolve) => setTimeout(resolve, realDelayTime));
};
