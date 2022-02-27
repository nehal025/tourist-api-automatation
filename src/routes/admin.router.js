const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')

const Place = require('../models/placeModel');
const Food = require('../models/foodModel');
const Hotel = require('../models/hotelModel');
const Restarurant = require('../models/restarurantModel');



AdminJS.registerAdapter(AdminJSMongoose)
const contentParent = {
  name: 'DATABASE',
}

const locale = {
  translations: {
    labels: {
      // change Heading for Login
      loginWelcome: 'Smart Tourist App',
    },
    messages: {
      loginWelcome: 'Admin Panel',
    },
  },
};

const adminBro = new AdminJS({
  resources: [
    { resource: Place, options: { parent: contentParent } },
    { resource: Hotel, options: { parent: contentParent } },
    { resource: Food, options: { parent: contentParent } },
    { resource: Restarurant, options: { parent: contentParent } },

  ], rootPath: '/admin',
  branding:
  {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg',
    companyName: "Smart Tourist App",
    softwareBrothers: false,

  },
  locale,
  dashboard: {
    handler: async () => {
    },
    component: AdminJS.bundle('../Component.jsx')
  },
})

const ADMIN = {
  email: process.env.ADMIN_NAME,
  password: process.env.ADMIN_PASSWORD,
}

const router = AdminJSExpress.buildAuthenticatedRouter(adminBro, {

  cookieName: process.env.ADMIN_COOKIE_NAME,
  cookiePassword: process.env.ADMIN_COOKIE_PASSWORD,
  resave: true,
  saveUninitialized: true,


  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN
    }
    return null

  }
})

module.exports = router;