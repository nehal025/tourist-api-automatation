const headless = require('../../../config/headless')

const puppeteer = require('puppeteer-extra')
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

const hotelScrapper = async (locationStr, stars) => {

  try {

    const browser = await puppeteer.launch({
      'defaultViewport': { 'width': width, 'height': height },
      ignoreDefaultArgs: ['--enable-automation'],
      args: minimal_args,
      headless: headless.headless
    });

    const page = await browser.newPage();
    await page.setUserAgent(" (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")

    // await page.setRequestInterception(true);


    // page.on('request', (req) => {

    //   if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
    //     req.abort();
    //   } else {
    //     req.continue();
    //   }

    // });


    let dataObj = [];
    let dataObj2 = [];
    var title, img, location, info, rating, reviews, price, star, booknow;


    await page.goto('https://www.booking.com/');

    await page.waitForSelector('#ss');
    await page.type('#ss', locationStr);

    await page.click('#frm > div.xp__fieldset.js--sb-fieldset.accommodation > div.xp__dates.xp__group > div.xp__dates-inner');


    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    var currentDate = [year, month, day].join('-');

    // console.log(currentDate)

    await page.click(`  #frm > div.xp__fieldset.js--sb-fieldset.accommodation > div.xp__dates.xp__group > div.xp-calendar > div > div > div.bui-calendar__content > div > table > tbody > tr > td[data-date="${currentDate}"]`);

    await page.click(`#frm > div.xp__fieldset.js--sb-fieldset.accommodation > div.xp__button > div.sb-searchbox-submit-col.-submit-button > button`);


    await page.waitForSelector('#search_results_table > div > div > div > div > div.d4924c9e74 > div[data-testid="property-card"]');
    const productsHandles = await page.$$('#search_results_table > div > div > div > div > div.d4924c9e74 > div[data-testid="property-card"]');

    for (const producthandle of productsHandles) {

      try {
        title = await page.evaluate(
          (el) => el.querySelector(' h3.a4225678b2 > a > div.fcab3ed991.a23c043802').textContent,
          producthandle
        );
      } catch (error) {
        title = "null"
      }

      try {
        img = await page.evaluate(
          (el) => el.querySelector('div.f9d4f2568d > div > a > img').getAttribute('src'),
          producthandle
        );
      } catch (error) {
        img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fvector-images%2Fno-image-available.html&psig=AOvVaw3-AqsT5YELbntN9ZchkiYI&ust=1641343482369000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJDTz4rvlvUCFQAAAAAdAAAAABAD"
      }

      location = locationStr;

      try {
        info = await page.evaluate(
          (el) => el.querySelector(' div.d8eab2cf7f > span').innerText,
          producthandle
        );
      } catch (error) {
        info = "null"
      }

      try {
        rating = await page.evaluate(
          (el) => parseFloat(el.querySelector(" div._7192d3184 > div > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div > a > span > div > div._9c5f726ff.bd528f9ea6").textContent),
          producthandle
        );
      } catch (error) {
        rating = 1
      }

      try {
        reviews = await page.evaluate(
          (el) => el.querySelector(" div.b5cd09854e.d10a6220b4").innerText,
          producthandle
        );
      } catch (error) {
        reviews = "null"
      }

      price = await page.evaluate(
        (el) => el.querySelector(" div.ca5bcdc79a.e702eddf3f > span").textContent,
        producthandle
      );

      Promise.all([price]).then((values) => {

        if (price.charAt(0) === '₹') {
          price = price.replace('₹', '');
          price = price.replace(',', '');
          price = price.trim()
          price = Number(price)
        } else {
          price = price.replace('$', '')
          price = price.trim()
          price = Number(price)
          price = price * 70
        }

        if(price<1000){
          star='1'

        }

        if(price>1000 && price<2000){
          star='2'

        }
        if(price>2000 && price<3000){
          star='3'

        }
        if(price>3000 && price<4000){
          star='4'

        }
        if(price>5000 ){
          star='5'

        }



      });

      // try {
      //   star = await page.evaluate(
      //     (el) => String(el.querySelector('div._29c344764._f57705597 > div > div:nth-child(1) > div > div > span > div > div[class="_bebcf8d60"]').childElementCount),
      //     producthandle
      //   );

      // } catch (error) {
      //    star = "3"
      //    console.log("hi")
      // }
      try {
        booknow = await page.evaluate(
          (el) => el.querySelector(' div[class="dd023375f5"] > h3 > a').getAttribute("href"),
          producthandle
        );
      } catch (error) {
        booknow = 'https://www.booking.com/'
      }

      try {
        if (stars.includes(star)) {
          dataObj.push(
            {
              title,
              img,
              location,
              info,
              star,
              price,
              rating,
              reviews,
              booknow
            }
          );
        }else{
          dataObj2.push(
            {
              title,
              img,
              location,
              info,
              star,
              price,
              rating,
              reviews,
              booknow
            }
          );
        }
      } catch (error) {
        dataObj.push(
          {
            title,
            img,
            location,
            info,
            star,
            price,
            rating,
            reviews,
            booknow
          }
        );
      }



    }
    browser.close();
    Array.prototype.push.apply(dataObj,dataObj2); 

    return dataObj;


  } catch (e) {
    console.log(e);
  }

  // console.log(dataObj)



};

module.exports = hotelScrapper;

