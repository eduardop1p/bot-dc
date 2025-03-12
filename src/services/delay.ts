export default async function delay(ms: number) {
  await new Promise(rs => setTimeout(rs, ms));
}
