export const emojiRegexExp =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

export const detectEmojiInString = (values: object) => {
  let detected = 0;
  const keys = Object.keys(values);
  keys.forEach((i) => {
    detected = emojiRegexExp.test(values[i]) ? detected + 1 : detected;
  });
  return detected;
};
