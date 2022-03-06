const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const width = 1024;
const height = 1600;

const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

const flightScrapper = async (from, to) => {

  try {

    const browser = await puppeteer.launch({
      'defaultViewport': { 'width': width, 'height': height },
      ignoreDefaultArgs: ['--enable-automation'],
      args: minimal_args,
      headless: true
    });

    const page = await browser.newPage();
    // await page.setUserAgent(" (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")
    await page.setRequestInterception(true);


    page.on('request', (req) => {

      if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
        req.abort();
      } else {
        req.continue();
      }

    });
    await page.goto('https://www.google.com/travel/flights/');

    await page.waitForSelector('#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div > c-wiz > c-wiz > div.Me3Qzc > div:nth-child(1) > div.SS6Dqf > div.ZqIz0.RIpLRb > div.Maqf5d > div.RLVa8.GeHXyb > div > div.v0tSxb.SOcuWe > div.dvO2xc.k0gFV > div > button')
    await page.click('#yDmH0d > c-wiz.zQTmif.SSPGKf > div > div:nth-child(2) > c-wiz > div > c-wiz > c-wiz > div.Me3Qzc > div:nth-child(1) > div.SS6Dqf > div.ZqIz0.RIpLRb > div.Maqf5d > div.RLVa8.GeHXyb > div > div.v0tSxb.SOcuWe > div.dvO2xc.k0gFV > div > button')
    await page.click('#ow18 > div.A8nfpe.yRXJAe.iWO5td > div:nth-child(2) > ul > li:nth-child(2)')


    await page.focus('#i15 > div.e5F5td.BGeFcf > div > div > div.dvO2xc.k0gFV > div > div > input');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.type('#i15 > div.e5F5td.BGeFcf > div > div > div.dvO2xc.k0gFV > div > div > input', from, { delay: 10 })
    await page.keyboard.press('Enter');

    await page.keyboard.press('Tab');

    await page.keyboard.type(to)
    await page.keyboard.press('Enter')
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter')

    await page.keyboard.press('Enter')



    let dataObj = [];
    var title, img, cost, time;
    var count = 0;


    await page.waitForSelector('div[role="listitem"]');

    const productsHandles = await page.$$(' div[class="mz0jqb taHBqe Qpcsfe"]');
    for (const producthandle of productsHandles) {

      try {
        title = await page.evaluate(
          (el) => el.querySelector('div.KC3CM > div.mxvQLc.ceis6c.uj4xv.uVdL1c.A8qKrc > div.OgQvJf.nKlB3b > div.Ir0Voe > div.TQqf0e.sSHqwe.tPgKwe.ogfYpf > span').textContent,
          producthandle
        );
      } catch (error) {
        title = null
      }
      try {
        img = await page.evaluate(
          (el) => el.querySelector(' div.KC3CM > div.mxvQLc.ceis6c.uj4xv.uVdL1c.A8qKrc > div.OgQvJf.nKlB3b > div.x8klId.I11szd > img').getAttribute('src'),
          producthandle
        );
        Promise.all([img]).then((values) => {
          img = img.replace('//', 'https://')


        });
      } catch (error) {
        img = null
      }

      try {
        cost = await page.evaluate(
          (el) => el.querySelector('div.KC3CM > div.mxvQLc.ceis6c.uj4xv.uVdL1c.A8qKrc > div.OgQvJf.nKlB3b > div.U3gSDe > div.BVAVmf.I11szd.POX3ye > div.YMlIz.FpEdX > span').textContent,
          producthandle
        );

        Promise.all([cost]).then((values) => {

          if (cost.charAt(0) === '₹') {
            cost = cost.replace('₹', '');
            cost = cost.replace(',', '');
            cost = cost.trim()
            cost = parseInt(cost)
          } else {
            cost = cost.replace('$', '')
            cost = cost.trim()
            cost = Number(cost)
            cost = cost * 70
          }




        });
      } catch (error) {
        cost = null
      }

      try {
        depTime = await page.evaluate(
          (el) => el.querySelector(' div.zxVSec.YMlIz.tPgKwe.ogfYpf > span > span:nth-child(1) > span > span > span').textContent,
          producthandle
        );
      } catch (error) {
        depTime = null
      }

      try {
        arrTime = await page.evaluate(
          (el) => el.querySelector('div.zxVSec.YMlIz.tPgKwe.ogfYpf > span > span:nth-child(2) > span > span > span').textContent,
          producthandle
        );
      } catch (error) {
        arrTime = null
      }
      Promise.all([depTime, arrTime]).then((values) => {
        time = depTime + ' - ' + arrTime

      });

      if (cost && title && time && img) {
        if (count <= 4) {
          dataObj.push(
            {
              title,
              img,
              cost,
              time
            }
          );
          count++
        }

      }

    }
    await browser.close();

    return dataObj;


  } catch (e) {
    console.log(e);
  }

  // console.log(dataObj)


};

module.exports = flightScrapper;