const { query } = require("express");
const WsClient = require('whalestack-sdk');
const client = new WsClient(
   'dc4f15a38156',
   'FcxY-Aheg-br!R-VKah-fa*6-jaR6'
);
module.exports = function (passport) {
   return {
      SetRouting: function (router) {
         router.get('/', this.indexPage);
         router.get('/signup', this.signup);
         router.get('/domain/checkout', this.domainCheckout);
         router.get('/create/customer', this.postCustomer);
         router.get('/webhook', this.verifyWebhook);
         router.get('/logout', this.logout);

         router.post('/create', this.createAccount);
         router.post('/login', this.getInside);
      },
      indexPage: async function (req, res) {
         return res.render('index', { domain: null });
      },
      signup: function (req, res) {
         return res.render('signup.ejs');
      },
      createAccount: passport.authenticate('local.signup', {
         successRedirect: '/',
         failureRedirect: '/',
         failureFlash: true
      }),
      getInside: passport.authenticate('local.login', {
         successRedirect: 'back',
         failureRedirect: 'back',
         failureFlash: true
      }),
      logout: function (req, res) {
         req.logout();
         res.redirect('/');
      },
      domainCheckout: async function (req, res) {
         let response = await client.post('/checkout/hosted', {
            "charge": {
               "customerId": "56b57d4fc60f",
               "billingCurrency": "USD",
               "lineItems": [
                  {
                     "description": "PCI Graphics Card",
                     "netAmount": 199,
                     "quantity": 1,
                     "productId": "P1234"
                  }
               ],
               "discountItems": [
                  {
                     "description": "Loyalty Discount",
                     "netAmount": 5
                  }
               ],
               "shippingCostItems": [
                  {
                     "description": "Shipping and Handling",
                     "netAmount": 3.99,
                     "taxable": false
                  }
               ],
               "taxItems": [
                  {
                     "name": "Sales Tax",
                     "percent": 0.0825
                  }
               ]
            },
            "settlementAsset": "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
            "checkoutLanguage": "en",
            "webhook": "https://www.your-server.com/path/to/webhook",
            "pageSettings": {
               "returnUrl": "https://www.merchant.com/path/to/complete/checkout",
               "cancelUrl": "https://www.merchant.com/path/to/cancel/checkout",
               "shopName": "Name Cheap Clone",
               "displayBuyerInfo": true,
               "displaySellerInfo": true
            },
            "meta": {
               "customAttribute": "customValue"
            },
            "anchors": {
               "BITCOIN": "BTC:GCQVEST7KIWV3KOSNDDUJKEPZLBFWKM7DUS4TCLW2VNVPCBGTDRVTEIT",
               "LITECOIN": "LTC:GCQVEST7KIWV3KOSNDDUJKEPZLBFWKM7DUS4TCLW2VNVPCBGTDRVTEIT"
            }
         });
         res.redirect(response.data.url);
      },
      postCustomer: async function (req, res) {
         let response = await client.post('/customer', {
            "customer": {
               "email": "john@doe.com",
               "firstname": "John",
               "lastname": "Doe",
               "company": "ACME Inc.",
               "adr1": "810 Beach St",
               "adr2": "Finance Dept",
               "zip": "CA 94133",
               "city": "San Francisco",
               "countrycode": "US",
               "phonenumber": "+14156226819",
               "taxid": "US1234567890",
               "note": "Always pays on time. Never late.",
               "meta": {
                  "reference": 123
               }
            }
         });
         console.log(response);
      },
      verifyWebhook: async (req, res) => {
         const authHeader = req.headers['x-webhook-auth'];
         const payload = req.body;

         if (authHeader !== crypto.createHash('sha256').update(yourApiSecret + JSON.stringify(payload)).digest('hex')) {
            return res.status(401).json({ error: 'Unauthorized' });
         }

         // Valid webhook, continue processing...
         // Your code logic here...

         res.status(200).send('Webhook processed successfully');
      }
   }
}