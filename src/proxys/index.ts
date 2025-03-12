const start = 5300;
const end = 5400;

const proxys = Array.from(
  { length: end - start + 1 },
  (v, k) => `15.229.27.68:${k + start}`
);

export default proxys;
