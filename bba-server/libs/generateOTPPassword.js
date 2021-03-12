module.exports = (length) => {
  const charset = "0123456789";
  let result = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    result += charset.charAt(Math.floor(Math.random() * n));
  }
  return result;
};
