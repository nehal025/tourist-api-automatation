const puppeteer = require("puppeteer");

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

const hotelScrapper = async (locationStr, stars) => {


  const browser = await puppeteer.launch({
    'defaultViewport': { 'width': width, 'height': height },
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['disable-gpu', '--disable-infobars', '--disable-extensions', '--ignore-certificate-errors'],
    headless: true
  });

  const page = await browser.newPage();
  await page.setUserAgent(" (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")

  let dataObj = [];
  var title, img, location, info, rating, reviews, price, star, booknow;


  await page.goto('https://www.makemytrip.com/flights/', { waitUntil: 'networkidle2' });

//   await page.waitForSelector('#ss');
//   await page.type('#ss', locationStr);

//   await page.click('#frm > div.xp__fieldset.js--sb-fieldset.accommodation > div.xp__dates.xp__group > div.xp__dates-inner');


  try {



  } catch (e) {
    console.log(e);
  }

  // console.log(dataObj)

  browser.close();

  return dataObj;

};

module.exports = hotelScrapper;