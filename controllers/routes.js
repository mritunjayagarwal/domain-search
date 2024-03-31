const { query } = require("express");
const WsClient = require('whalestack-sdk');
const crypto = require('crypto');
const client = new WsClient(
   'dc4f15a38156',
   'FcxY-Aheg-br!R-VKah-fa*6-jaR6'
);

const vallidateRequest = function (data) {
   const secretKey = "F-6S-8Ms_UWdHYIkg9Vb6Xo168fHi2XfJhp5b7RX2nLqokL0gdiYHZP_VI83Qsco";
   if (typeof data === 'object' && data.verify_hash && secretKey) {
      const ordered = { ...data };
      delete ordered.verify_hash;
      const string = JSON.stringify(ordered);
      const hmac = crypto.createHmac('sha1', secretKey);
      hmac.update(string);
      const hash = hmac.digest('hex');
      console.log(hash === data.verify_hash)
      return hash === data.verify_hash;
   }
   return false;
}

module.exports = function (passport, axios, User, xml2js) {
   return {
      SetRouting: function (router) {
         router.get('/', this.indexPage);
         router.get('/signup', this.signup);
         router.get('/login', this.login);
         router.post('/checkout', this.domainCheckout);
         router.post('/success', this.verifyWebhook);
         router.get('/logout', this.logout);

         router.post('/create', this.createAccount);
         router.post('/login', this.getInside);
      },
      indexPage: async function (req, res) {
         return res.render('index', { domain: null, user: req.user ?? null });
      },
      signup: function (req, res) {
         if (req.user) return res.redirect('/');
         return res.render('signup.ejs');
      },
      login: function (req, res) {
         if (req.user) return res.redirect('/');
         return res.render('login.ejs');
      },
      createAccount: passport.authenticate('local.signup', {
         successRedirect: '/',
         failureRedirect: 'back',
         failureFlash: true
      }),
      getInside: passport.authenticate('local.login', {
         successRedirect: '/',
         failureRedirect: 'back',
         failureFlash: true
      }),
      logout: function (req, res) {
         req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
         });
      },
      domainCheckout: async function (req, res) {
         if (req.user == undefined) return res.redirect("/");
         let status = false;
         if (req.body.fname === undefined || req.body.lname === undefined || req.body.phone === undefined || req.body.address === undefined || req.body.orgname === undefined || req.body.country === undefined || req.body.state === undefined | req.body.city === undefined || req.body.zip === undefined || req.body.domainName === undefined) {
            return res.redirect('/');
         }
         const prices = [
            {
               "TLD": "com",
               "Price": 2.2,
            }
         ]
         let price;
         if (prices.map(price => price.TLD).includes(req.body.domainName.split('.')[1])) {
            console.log("Yes");
            price = prices.find(price => price.TLD == req.body.domainName.split('.')[1]).Price;
            console.log(price);
         } else {
            console.log("Did not exists");
            return res.redirect('/');
         }
         const returnQuery = async () => {
            return await User.findOneAndUpdate({ _id: req.user._id }, {
               $set: {
                  fname: req.body.fname, 
                  lname: req.body.lname,
                  phone: req.body.phone,
                  address: req.body.address,
                  organisation: req.body.orgname,
                  country: req.body.country,
                  state: req.body.state,
                  city: req.body.city,
                  zip: req.body.zip
               }
            }, (err, result) => {
               if (err) status = true;
            });
         }
         returnQuery();
         if (status) return res.redirect('/');
         try {
            const resp = await axios({
               method: 'get',
               url: 'https://api.plisio.net/api/v1/invoices/new',
               params: {
                  source_currency: 'USD',
                  source_amount: price ?? 1,
                  order_number: req.user._id + 'plisio' + Math.floor(Math.random() * (100000 - 1) + 1),
                  currency: 'TRX',
                  email: req.user.email,
                  order_name: req.body.domainName,
                  callback_url: "https://59c5-103-47-75-53.ngrok-free.app/success?json=true",
                  api_key: 'F-6S-8Ms_UWdHYIkg9Vb6Xo168fHi2XfJhp5b7RX2nLqokL0gdiYHZP_VI83Qsco'
               }
            });
            console.log(resp.data.data);
            if (resp.data.status !== 'success') return res.send("Failure!")
            res.redirect(resp.data.data.invoice_url);
         } catch (error) {
            console.log(error.response.data);
         }
      },
      verifyWebhook: async (req, res) => {
         console.log("Okay! Lolll Reacheddd")
         const data = JSON.parse(req.rawBody);
         const userId = data.order_number.split('plisio')[0];
         if (data && vallidateRequest(data) && data.status === "completed") {
            console.log("reached true case")
            const user = await User.findOne({_id: userId});
            console.log(user)
            const resp = await axios({
               method: 'get',
               url: 'https://api.sandbox.namecheap.com/xml.response',
               params: {
                  ApiUser: 'Prithvi0707',
                  ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                  UserName: 'Prithvi0707',
                  Command: "namecheap.domains.create",
                  ClientIp: "122.161.72.212",
                  DomainName: data.order_name,
                  Years: 1,
                  AuxBillingFirstName: user.fname,
                  AuxBillingLastName: user.lname,
                  AuxBillingAddress1: user.address,
                  AuxBillingStateProvince: user.state,
                  AuxBillingPostalCode: user.zip,
                  AuxBillingCountry: user.country,
                  AuxBillingPhone: " 1." + user.phone,
                  AuxBillingEmailAddress: user.email,
                  AuxBillingOrganizationName: user.organisation,
                  AuxBillingCity: user.city,
                  TechFirstName: user.fname,
                  TechLastName: user.lname,
                  TechAddress1: user.address,
                  TechStateProvince: user.state,
                  TechPostalCode: user.zip,
                  TechCountry: user.country,
                  TechPhone: " 1." + user.phone,
                  TechEmailAddress: user.email,
                  TechOrganizationName: user.organisation,
                  TechCity: user.city,
                  AdminFirstName: "John",
                  AdminLastName: "Smith",
                  AdminAddress1: "8939%cross%20Blvd",
                  AdminStateProvince: "CA",
                  AdminPostalCode: "9004",
                  AdminCountry: "US",
                  AdminPhone: " 1.6613102107",
                  AdminEmailAddress: "joe@gmail.com",
                  AdminOrganizationName: "NC",
                  AdminCity: "CA",
                  RegistrantFirstName: user.fname,
                  RegistrantLastName: user.lname,
                  RegistrantAddress1: user.address,
                  RegistrantStateProvince: user.state,
                  RegistrantPostalCode: user.zip,
                  RegistrantCountry: user.country,
                  RegistrantPhone: " 1." + user.phone,
                  RegistrantEmailAddress: user.email,
                  RegistrantOrganizationName: user.organisation,
                  RegistrantCity: user.city,
                  AddFreeWhoisguard: "no",
                  WGEnabled: "no",
                  GenerateAdminOrderRefId: "False",
                  IsPremiumDomain: "False",
                  EapFee: "0"
               }
            });
            xml2js.parseString(resp.data, async function (err, results) {
               if (results.ApiResponse.$.Status == "OK") {
                  await User.findOneAndUpdate({ _id: userId }, {
                     $push: {
                        domains: data.order_name
                     }
                  })
               }else{
                  console.log(results.ApiResponse.Error);
               }
            });
            res.writeHead(200);
            res.end('This is a correct JSON callback');
         } else {
            console.log("Reached false case")
            res.writeHead(422);
            res.end('Incorrect data 1');
         }
      }
   }
}