import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// export default async function puppeteerConfig() {
//   const proxy = 'http://gw.dataimpulse.com:823';

//   const browser = await puppeteer.use(StealthPlugin()).launch({
//     headless: false,
//     defaultViewport: null,
//     args: [
//       // '--no-sandbox',
//       // '--disable-setuid-sandbox',
//       // '--disable-dev-shm-usage',
//       // '--disable-gpu',
//       // '--mute-audio',
//       `--proxy-server=${proxy}`,
//     ],
//     executablePath:
//       'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
//     userDataDir:
//       'C:\\Users\\el702\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
//   });

//   const page = await browser.newPage();

//   await page.authenticate({
//     username: '18b45b183e191d3e4fbc', // Substitua pelo seu nome de usuário DataImpulse.
//     password: 'f743e01b1543232f', // Substitua pela sua senha DataImpulse.
//   });

//   await page.setRequestInterception(true);
//   page.on('request', async (request: any) => {
//     const blockTypes = [''];
//     // const blockTypes = ['stylesheet', 'font', 'image'];
//     if (blockTypes.includes(request.resourceType())) {
//       await request.abort();
//     } else {
//       await request.continue();
//     }
//   });

//   return { page, browser };
// }

import { connect } from 'puppeteer-real-browser';

export default async function puppeteerConfig() {
  const { browser, page } = await connect({
    headless: false,
    args: ['--start-maximized'],
    // customConfig: {
    //   chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    //   userDataDir:
    //     'C:\\Users\\el702\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
    // },
    proxy: {
      host: 'http://gw.dataimpulse.com',
      port: 823,
      username: '18b45b183e191d3e4fbc',
      password: 'f743e01b1543232f',
    },
  });
  const { width, height } = await page.evaluate(() => {
    return {
      width: window.screen.width,
      height: window.screen.height,
    };
  });

  await page.setViewport({ width, height });

  return { browser, page };
}
