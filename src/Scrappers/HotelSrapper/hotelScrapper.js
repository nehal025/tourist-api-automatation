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
    args: minimal_args,
    headless: true
  });

  const page = await browser.newPage();
  await page.setUserAgent(" (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")

  let dataObj = [];
  var title, img, location, info, rating, reviews, price, star, booknow;


  await page.goto('https://www.booking.com/', { waitUntil: 'networkidle2' });

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

  try {

    await page.waitForSelector('#search_results_table > div:nth-child(1) > div > div > div > div._814193827 > div[class="_fe1927d9e _0811a1b54 _a8a1be610 _022ee35ec b9c27d6646 fb3c4512b4 fc21746a73"]');
    const productsHandles = await page.$$('#search_results_table > div:nth-child(1) > div > div > div > div._814193827 > div[class="_fe1927d9e _0811a1b54 _a8a1be610 _022ee35ec b9c27d6646 fb3c4512b4 fc21746a73"]');

    for (const producthandle of productsHandles) {

      try {
        title = await page.evaluate(
          (el) => el.querySelector('div[class="_12369ea61"] > h3 > a > div.fde444d7ef._c445487e2').textContent,
          producthandle
        );
      } catch (error) {
        title = "null"
      }

      try {
        img = await page.evaluate(
          (el) => el.querySelector('div._5d6c618c8 > div._661592f4c > div > a > img').getAttribute('src'),
          producthandle
        );
      } catch (error) {
        img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fvector-images%2Fno-image-available.html&psig=AOvVaw3-AqsT5YELbntN9ZchkiYI&ust=1641343482369000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJDTz4rvlvUCFQAAAAAdAAAAABAD"
      }

      location = locationStr;

      try {
        info = await page.evaluate(
          (el) => el.querySelector(' div._5d6c618c8 > div._7192d3184 > div > div > div > div._704a7d7ac > div > div > div > div._4abc4c3d5 > span').innerText,
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
          (el) => el.querySelector(" div._7192d3184 > div > div> div > div> div > div > div > div > a > span > div > div._f8ff3180e.b8710dea1b > div._4abc4c3d5._1e6021d2f._6e869d6e0").innerText,
          producthandle
        );
      } catch (error) {
        reviews = "null"
      }

      try {
        price = await page.evaluate(
          (el) => el.querySelector(" div.c5246b6797._5aba9d433 > span.fde444d7ef._e885fdc12").textContent,
          producthandle
        );
    
      } catch (error) {
        price = "null"
      }

      try {
        star = await page.evaluate(
          (el) => String(el.querySelector('  div._29c344764._f57705597 > div > div:nth-child(1) > div > div > span > div > div').childElementCount),
          producthandle
        );

      } catch (error) {
        star = "3"
      }
      try {
        booknow = await page.evaluate(
          (el) => el.querySelector(' div._29c344764._f57705597 > div > div > div > h3 > a').getAttribute("href"),
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

  } catch (e) {
    console.log(e);
  }

  // console.log(dataObj)

  browser.close();

  return dataObj;

};

module.exports = hotelScrapper;