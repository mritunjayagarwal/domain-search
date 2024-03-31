const { query } = require("express");
module.exports = function (User, axios, xml2js) {
    return {
        SetRouting: function (router) {
            router.post('/domain/search', this.searchDomain);
            router.get('/domain/buy', this.buyDomain);
            router.get('/user/domains', this.getUserDomains);
            router.get('/domains/list', this.listDomains);
            router.get('/domain/:domainName', this.getDomainInfo)
            router.post('/domain/custom/dns', this.setCustomDNS)
        },
        searchDomain: async function (req, res) {
            const resp = await axios({
                method: 'get',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Prithvi0707',
                    ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                    UserName: 'Prithvi0707',
                    Command: 'namecheap.domains.check',
                    ClientIp: '122.161.72.212',
                    DomainList: req.body.domainName
                }
            });
            let domain;
            xml2js.parseString(resp.data, function (err, results) {
                if(results.ApiResponse.$.Status == "OK"){
                    console.log(results.ApiResponse.CommandResponse[0].DomainCheckResult[0].$)
                    domain = results.ApiResponse.CommandResponse[0].DomainCheckResult[0].$
                }else return false
            });
            return res.render('index', {domain, user: req.user ?? null})
        },
        buyDomain: async (req, res, next) => {
            console.log(req.body.domainName);
            const user = req.user;
            console.log(user);
            const resp = await axios({
                method: 'get',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params: {
                   ApiUser: 'Prithvi0707',
                   ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                   UserName: 'Prithvi0707',
                   Command: "namecheap.domains.create",
                   ClientIp: "122.161.72.212",
                   DomainName: 'mrituuuuuuu.com',
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
                   res.send(results);
                }
             });
        },
        getUserDomains: async (req, res, next) => {
            const resp = await axios({
                method: 'get',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Prithvi0707',
                    ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                    UserName: 'Prithvi0707',
                    Command: 'namecheap.domains.getList',
                    ClientIp: '122.161.72.212',
                }
            });
            xml2js.parseString(resp.data, function (err, results) {
                // display the json data 
                return res.send(results);
            });
        },
        listDomains: async (req, res, next) => {
            if(req.user === undefined) return res.redirect('/');
            console.log(req.user)
            const resp = await axios({
                method: 'get',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Prithvi0707',
                    ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                    UserName: 'Prithvi0707',
                    Command: 'namecheap.domains.getList',
                    ClientIp: '122.161.72.212',
                }
            });
            xml2js.parseString(resp.data, function (err, results) {
                // display the json data 
                console.log(results)
                if(req.user === undefined) return false;
                const userDomains = req.user.domains.map(domain => domain.toLowerCase());
                const domains = results.ApiResponse.CommandResponse[0].DomainGetListResult[0].Domain.filter(domain => userDomains.includes(domain.$.Name));
                console.log(results.ApiResponse.CommandResponse[0].DomainGetListResult[0].Domain)
                return res.render('dashboard', {domains, user: req.user ?? {}})
            });

            // return res.render('dashboard', {domains: [], user: req.user ?? {}})
        },
        getDomainInfo: async (req, res) => {
            console.log(req.params.domainName);
            if(req.params.domainName == undefined) return false;
            const resp = await axios({
                method: 'get',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Prithvi0707',
                    ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                    UserName: 'Prithvi0707',
                    Command: 'namecheap.domains.getinfo',
                    ClientIp: '122.161.72.212',
                    DomainName: req.params.domainName
                }
            });
            let domain;
            xml2js.parseString(resp.data, function (err, results) {
                const userDomains = req.user.domains.map(domain => domain.toLowerCase());
                console.log(results.ApiResponse.CommandResponse[0].DomainGetInfoResult[0])
                if(userDomains.includes(results.ApiResponse.CommandResponse[0].DomainGetInfoResult[0].$.DomainName)){
                    return res.render('domain', {domain: results.ApiResponse.CommandResponse[0].DomainGetInfoResult[0], user: req.user});
                }else res.send("404 error")
            });
            // return res.render('index', {domain})
        },
        setCustomDNS: async (req, res) => {
            console.log(req.body.domainName, req.body.nameserver1, req.body.nameserver2);
            console.log([req.body.nameserver1, req.body.nameserver2].join(','));
            console.log(req.body.domainName.split('.')[1]);
            if(req.body.domainName == undefined) return res.send("No Domain Name Found");
            const resp = await axios({
                method: 'post',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Prithvi0707',
                    ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                    UserName: 'Prithvi0707',
                    Command: 'namecheap.domains.dns.setCustom',
                    ClientIp: '122.161.72.212',
                    SLD: req.body.domainName.split('.')[0],
                    TLD: req.body.domainName.split('.')[1],
                    Nameservers: [req.body.nameserver1, req.body.nameserver2].join(',')
                }
            });
            xml2js.parseString(resp.data, function (err, results) {
                return res.send(results);
            });
        }
    }
}