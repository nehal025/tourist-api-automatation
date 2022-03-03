const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const width = 1024;
const height = 1600;
const pageURL = 'https://www.trainman.in/';

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

const tarinsScrapper = async (from, to) => {


  const browser = await puppeteer.launch({
    'defaultViewport': { 'width': width, 'height': height },
    ignoreDefaultArgs: ['--enable-automation'],
    args: minimal_args,
    headless: true
  });

  const page = await browser.newPage();
  await page.setUserAgent(" (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")


  await page.goto(pageURL);
  await page.waitForSelector('#mat-input-3')
  await page.type('#mat-input-3', 'kalyan ')
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter')

  await page.type('#mat-input-4', 'pune')
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter')
  await page.click('#trainbtwStation > form > div > div.full-width.flex.mar-hr-8.mar-vr-4.tbs-button-style > button > span')
  let dataObj = [];
  var count=0;
  var title, img, cost, time;
  try {

    await page.waitForSelector('#wrapper-content > main > trainlist > div.p-lg-3.bg-light.card-container.pt-3 > div[class="card border-top horizontal-box box-shadow ng-star-inserted"]')

    const productsHandles = await page.$$('#wrapper-content > main > trainlist > div.p-lg-3.bg-light.card-container.pt-3 > div[class="card border-top horizontal-box box-shadow ng-star-inserted"]');    for (const producthandle of productsHandles) {
  

      for (const producthandle of productsHandles) {

        try {
          title = await page.evaluate(
            (el) => el.querySelector(' div.mb-sm-2.mb-1 > div ').textContent,
            producthandle
          );
        } catch (error) {
          title = null
        }
  
        try {
  
          cost = await page.evaluate(
            (el) => el.querySelector('div.ng-star-inserted > a').textContent,
            producthandle
          );
          Promise.all([cost]).then((values) => {
  
            cost = cost.replace('₹', '')
             cost=cost.trim()
             cost = parseInt(cost)
    
      
          })
    
  
  
        } catch (error) {
          cost = null
        }
  
        try {
          trainClass = await page.evaluate(
            (el) => el.querySelector(' div.card.alternate-theme.m-0 > div > div:nth-child(1)').textContent,
            producthandle
          );
          Promise.all([trainClass]).then((values) => {
  
            trainClass=trainClass.trim()
    
      
          })
        } catch (error) {
          trainClass = null
        }
        try {
          depTime = await page.evaluate(
            (el) => el.querySelector('  div.col-4.text-left.pr-0 > div.scode-font > time').textContent,
            producthandle
          );
        } catch (error) {
          depTime = null
        }
    
        try {
          arrTime = await page.evaluate(
            (el) => el.querySelector(' div.col-4.text-right.pl-0 > div.scode-font > time').textContent,
            producthandle
          );
        } catch (error) {
          arrTime = null
        }
        Promise.all([depTime, arrTime]).then((values) => {
          time = depTime + ' - ' + arrTime
    
        });
        if (cost && title && time) {
          if(count<=9){
            dataObj.push(
              {
                title,
                cost,
                time,
                trainClass
      
              }
            );
  
            count++
          }
      
        }
  
  
  
  
  
      }


  
  

  
  
    }

  } catch (e) {
    console.log(e);
  }

  // console.log(dataObj)

  await browser.close();

  return dataObj;

};

module.exports = tarinsScrapper;

