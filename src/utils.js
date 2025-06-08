export const generateString = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};

export const generateUniqueId = (checkFunction) => {
  const id = generateString(5);
  if (checkFunction(id)) {
    return generateUniqueId(checkFunction);
  }
  return id;
};

export const validateUrl = (url) => {
  const urlPattern =
    /^(https?|mailto):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[1][2][3][4][5][6]{1,5})?(\/.*)?$/gm;
  return urlPattern.test(url.toLowerCase());
};

export const tryAsync = async (fn) => {
  try {
    return await fn();
  } catch {
    return null;
  }
};
