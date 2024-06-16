module.exports = (start, end) => {
  if (!start) start = new Date(2012, 0, 1);
  if (!end) end = new Date();

  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
