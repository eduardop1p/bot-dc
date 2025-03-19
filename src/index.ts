/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import puppeteer, { Browser } from 'puppeteer';
import { ElementHandle } from 'puppeteer';
import path from 'node:path';
import os from 'node:os';
import fs, { link } from 'node:fs';

import readline from 'readline';

import delay from './services/delay';
import capsolver from './functions/capsolver';
import puppeteerConfig from './config/puppeteerConfig';

process.stdin.resume();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const chromeUserDataPath = path.join(
  os.homedir(),
  'AppData',
  'Local',
  'Google',
  'Chrome',
  'User Data',
  'Default'
);

const getChromeExecutablePath = () => {
  const possiblePaths = [
    path.join(
      process.env.PROGRAMFILES!,
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    ),
    path.join(
      process.env['PROGRAMFILES(X86)']!,
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    ),
  ];

  return possiblePaths.find(fs.existsSync);
};

const chromePath = getChromeExecutablePath();

(async () => {
  let searchQuery = '';
  let links: string[] = [];
  let numberClicks = 0;

  const input = (question: string) => {
    return new Promise(resolve => {
      rl.question(question, response => {
        resolve(response.trim());
      });
    });
  };

  console.log('------------------ Bot iniciado ------------------');
  console.log();
  searchQuery = String(await input('Qual a pesquisa? '));
  numberClicks = Number(await input('Quantidade de clicks: '));
  links = String(await input('Links para não clicar: ')).trim().split(','); // eslint-disable-line
  links = links.map(item =>
    item.endsWith('/') ? item.slice(0, -1).trim() : item.trim()
  );
  rl.close();
  console.log();
  console.log('------------------ Bot rodando ------------------');

  const isLoop = true;
  while (isLoop) {
    let browser: any = null;
    try {
      const config = await puppeteerConfig();
      browser = config.browser;
      const page = config.page;
      await page.goto(
        `https://www.google.com/search?q=${searchQuery}&tbs=ad:1`,
        {
          waitUntil: 'networkidle2',
          timeout: 30000,
        }
      );
      // const textareaSelector = '#APjFqb';
      // await page.waitForSelector(textareaSelector);
      // await page.type(textareaSelector, searchQuery, { delay: 50 });
      // await page.keyboard.press('Enter');

      // await page.waitForNavigation({ waitUntil: 'networkidle2' });
      // await delay(2000);

      await delay(2000);
      const gElement = (await page.$(
        '#g-recaptcha-response'
      )) as ElementHandle<HTMLTextAreaElement> | null;
      const captchaForm = (await page.$(
        '#captcha-form'
      )) as ElementHandle<HTMLFormElement> | null;
      if (gElement && captchaForm) {
        await browser.close();
        continue;
      }

      const adsSelector = '[data-text-ad]';
      // await page.waitForSelector(adsSelector);
      const adsDivs = await page.$$(adsSelector);
      if (!adsDivs.length) {
        console.log('reabrindo navegador com novo proxy');
        await browser.close();
        continue;
      }
      let numberClicksController = numberClicks;
      while (numberClicksController) {
        for (const adsDiv of adsDivs) {
          await delay(50);
          const adsLink = await adsDiv.$('a');
          if (adsLink) {
            const dataPcuAttribute = await page.evaluate(adsLink => {
              const attribute = adsLink.getAttribute('data-pcu');
              return attribute ? attribute.trim() : '';
            }, adsLink);
            let arrDataPcuAttribute = dataPcuAttribute.split(',');
            arrDataPcuAttribute = arrDataPcuAttribute.map(item =>
              item.endsWith('/') ? item.slice(0, -1).trim() : item.trim()
            );
            const containsAtLeastOne = links.some(item =>
              arrDataPcuAttribute.includes(item)
            );
            if (containsAtLeastOne) {
              console.log(
                `Sua campanha foi encontrada: ${arrDataPcuAttribute.join(',')}, contornando ela...`
              );
              // https://webguiasvelcularpr.online, https://www.despachantecamargo.online, https://www.acessosdeguiiaspaaraveriificaar.site, https://www.guiasemissaofacilmente.com, https://veiculospr.transitorapidofacil.com, https://www.atndinteligentedeguia.store
              continue;
            }
            await page.keyboard.down('Control');
            await adsLink.click();
          }
        }
        --numberClicksController;
      }
      setTimeout(async () => {
        await browser.close();
      }, 30000);
      continue;
    } catch (err) { // eslint-disable-line
      console.log(err);
      console.log('reabrindo navegador com novo proxy');
      await browser.close();
      continue;
    }
  }
})();

// import readline from 'readline';

// // import capsolver from './functions/capsolver';
// import delay from './services/delay';

// process.stdin.resume();
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// async function init() {
//   const proxy = 'http://gw.dataimpulse.com:823';

//   const browser = await puppeteer.launch({
//     defaultViewport: null,
//     args: [`--proxy-server=${proxy}`],
//     headless: false,
//   });

//   const page = await browser.newPage();
//   await page.authenticate({
//     username: '18b45b183e191d3e4fbc', // Substitua pelo seu nome de usuário DataImpulse.
//     password: 'f743e01b1543232f', // Substitua pela sua senha DataImpulse.
//   });

//   await page.goto('https://www.google.com/search?q=pr', {
//     waitUntil: 'networkidle2',
//   });
//   await delay(1000);

//   const gElement = (await page.$(
//     '#g-recaptcha-response'
//   )) as ElementHandle<HTMLTextAreaElement> | null;
//   const captchaForm = (await page.$(
//     '#captcha-form'
//   )) as ElementHandle<HTMLFormElement> | null;
//   const token = await capsolver();
//   console.log('token gerado');
//   if (gElement && captchaForm) {
//     await page.evaluate(
//       (gElement, token) => {
//         gElement.style.display = 'block';
//         gElement.value = token;
//       },
//       gElement,
//       token
//     );
//     // await delay(1000);
//     // await page.evaluate(captchaForm => {
//     //   captchaForm.submit();
//     // }, captchaForm);

//     // console.log(token);
//   }
// }

// init();
