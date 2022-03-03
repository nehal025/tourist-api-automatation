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
  '--use-mock-keychain',
];

const liveRestarurantScrapper = async locationStr => {

  const browser = await puppeteer.launch({
    'defaultViewport': { 'width': width, 'height': height },
    ignoreDefaultArgs: ['--enable-automation'],
    args: minimal_args,
    headless: true

  });

  const page = await browser.newPage();  
  await page.setUserAgent(" (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")

  let dataObj = [];
  var title, img, location, info, rating, bookNow;


  await page.goto('https://www.swiggy.com/');

  await page.waitForSelector('#location')
  await page.click('#location')
  await page.type('#location',locationStr)

  await page.keyboard.press('Enter');

  await page.waitForSelector('#root > div._3arMG > div.nDVxx > div > div._1TWur > div._2COmU > div > div._3mZgT > div > div._1oLDb > div._3lmRa');
  await page.click('#root > div._3arMG > div.nDVxx > div > div._1TWur > div._2COmU > div > div._3mZgT > div > div._1oLDb > div._3lmRa', { visible: true })
  
  await page.waitForSelector('#all_restaurants > div._10p2- > div.k4axS > div > div > div > div._3Ynv- > div._2-ofZ._3hfyI');
  await page.click(' #all_restaurants > div._10p2- > div.k4axS > div > div > div > div._3Ynv- > div._2-ofZ._3hfyI')


  try {

    await page.waitForSelector('#all_restaurants > div > div._2GhU5 > div > div > div > div[class="_3XX_A"]');

    const productsHandles = await page.$$('#all_restaurants > div > div._2GhU5 > div > div > div > div[class="_3XX_A"]');

    for (const producthandle of productsHandles) {

      try {
        title = await page.evaluate(
          (el) => el.querySelector('div._3FR5S > div._3Ztcd > div.nA6kb').textContent,
          producthandle
        );
      } catch (error) {
        title = null

      }

      try {
        img = await page.evaluate(
          (el) => el.querySelector('div._3FR5S > div.efp8s > img').getAttribute('src'),
          producthandle
        );
      } catch (error) {
        img = null
      }

      try {
        info = await page.evaluate(
          (el) => el.querySelector(' div._3FR5S > div._3Ztcd > div._1gURR').textContent,
          producthandle
        );
      } catch (error) {
        info = 'null'
      }
      try {
        rating = await page.evaluate(
          (el) => Number(el.querySelector("div._3FR5S > div._3Mn31 > div._9uwBC.wY0my").innerText),
          producthandle
        );
      } catch (error) {
        rating = 1
      }

      try {
        bookNow = 'https://www.swiggy.com' + await page.evaluate(
          (el) => el.querySelector('div[class="MZy1T"]> div[class="_3XX_A"] > a').getAttribute('href'),
          producthandle
        );
      } catch (error) {
        bookNow = 'https://www.swiggy.com'
      }
      
      location=locationStr;

      if (title && img) {
        dataObj.push(
          {
            title,
            img,
            location,
            info,
            rating,
            bookNow
          }
        );
      }

    }

  } catch (e) {
    console.log(e);
  }
  // console.log(dataObj)

   browser.close();

  return dataObj;

};

module.exports = liveRestarurantScrapper;