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

const placeScrapper = async locationStr => {

  const browser = await puppeteer.launch({
    'defaultViewport': { 'width': width, 'height': height },
    ignoreDefaultArgs: ['--enable-automation'],
    args: minimal_args,
    headless: true

  });

  const page = await browser.newPage();

     await page.goto('https://www.google.com/travel/');
     await page.type('#oA4zhb', locationStr);

    await Promise.all([
      page.keyboard.press('Enter'),
      page.waitForNavigation()
    ]);

    await page.waitForSelector('.sUF6Ec .kQb6Eb');

  
    let dataObj = [];
    var title, img,  info,location;
    try {
     
      await page.waitForSelector('.f4hh3d');
  
      const productsHandles = await page.$$('.f4hh3d');
      for (const producthandle of productsHandles) {
  
        try {
          title = await page.evaluate(
            (el) => el.querySelector(' .rbj0Ud').textContent,
            producthandle
          );
        } catch (error) {
          title = "null"
        }
  
        try {
          img = await page.evaluate(
            (el) => el.querySelector(' div.kXlUEb > easy-img > img[class="R1Ybne YH2pd"]').getAttribute('src'),
            producthandle
          );
        } catch (error) {
          img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fvector-images%2Fno-image-available.html&psig=AOvVaw3-AqsT5YELbntN9ZchkiYI&ust=1641343482369000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJDTz4rvlvUCFQAAAAAdAAAAABAD"
        }
  
        try {
          info = await page.evaluate(
            (el) => el.querySelector('.nFoFM').textContent,
            producthandle
          );
        } catch (error) {
          info = locationStr
        }
     
          location = locationStr
  
        dataObj.push(
          {
            title,
            img,
            info,
            location
          }
        );
      }
  
    } catch (e) {
      console.log(e);
    }
    // console.log(dataObj)
  // console.log(dataObj)

   browser.close();

  return dataObj;

};

module.exports = placeScrapper;