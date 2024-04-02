const { query } = require("express");
module.exports = function (User, axios, xml2js) {
    return {
        SetRouting: function (router) {
            router.post('/domain/search', this.searchDomain);
            // router.get('/domain/buy', this.buyDomain);
            router.get('/user/domains', this.getUserDomains);
            router.get('/domains/list', this.listDomains);
            router.get('/domain/:domainName', this.getDomainInfo)
            router.post('/domain/custom/dns', this.setCustomDNS)
        },
        searchDomain: async function (req, res) {
            const prices = [
                {
                    "TLD": "com",
                    "Price": 14.9,
                },
                {
                    "TLD": "net",
                    "Price": 16.1,
                },
                {
                    "TLD": "org",
                    "Price": 13.49,
                },
                {
                    "TLD": "co",
                    "Price": 32.2,
                },
                {
                    "TLD": "dev",
                    "Price": 16.17,
                },
                {
                    "TLD": "io",
                    "Price": 49.78,
                }
            ]
            if(req.body.domainName === undefined || req.body.tld === undefined) return res.redirect('/');
            const domainName = req.body.domainName.split('.')[0];
            if (prices.map(price => price.TLD).includes(req.body.tld)) {
                console.log("Yes");
            } else {
                console.log("Did not exists");
                return res.redirect('/');
            }
            const resp = await axios({
                method: 'get',
                url: 'https://api.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Webdomainservice',
                    ApiKey: "a50c0d969a584010be0e008abc573168",
                    UserName: 'Webdomainservice',
                    Command: 'namecheap.domains.check',
                    ClientIp: '122.161.72.212',
                    DomainList: domainName + "." + req.body.tld
                }
            });
            let domain;
            xml2js.parseString(resp.data, function (err, results) {
                if (results.ApiResponse.$.Status == "OK") {
                    console.log(results.ApiResponse.CommandResponse[0].DomainCheckResult[0].$)
                    domain = results.ApiResponse.CommandResponse[0].DomainCheckResult[0].$
                } else return false
            });
            return res.render('index', { domain, user: req.user ?? null, domains: prices ?? []})
        },
        // buyDomain: async (req, res, next) => {
        //     console.log(req.query.domainName);
        //     const user = req.user;
        //     console.log(user);
        //     const resp = await axios({
        //         method: 'get',
        //         url: 'https://api.sandbox.namecheap.com/xml.response',
        //         params: {
        //             ApiUser: 'Prithvi0707',
        //             ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
        //             UserName: 'Prithvi0707',
        //             Command: "namecheap.domains.create",
        //             ClientIp: "122.161.72.212",
        //             DomainName: req.query.domainName,
        //             Years: 1,
        //             AuxBillingFirstName: "John",
        //             AuxBillingLastName: "Smith",
        //             AuxBillingAddress1: "8939 S.cross Blv",
        //             AuxBillingStateProvince: "CA",
        //             AuxBillingPostalCode: "90045",
        //             AuxBillingCountry: "US",
        //             AuxBillingPhone: " 1.6613102107",
        //             AuxBillingEmailAddress: "john@gmail.com",
        //             AuxBillingOrganizationName: "NC",
        //             AuxBillingCity: "CA",
        //             TechFirstName: "John",
        //             TechLastName: "Smith",
        //             TechAddress1: "8939 S.cross Blvd",
        //             TechStateProvince: "CA",
        //             TechPostalCode: "90045",
        //             TechCountry: "US",
        //             TechPhone: " 1.6613102107",
        //             TechEmailAddress: "john@gmail.com",
        //             TechOrganizationName: "NC",
        //             TechCity: "CA",
        //             AdminFirstName: "John",
        //             AdminLastName: "Smith",
        //             AdminAddress1: "8939%cross%20Blvd",
        //             AdminStateProvince: "CA",
        //             AdminPostalCode: "9004",
        //             AdminCountry: "US",
        //             AdminPhone: " 1.6613102107",
        //             AdminEmailAddress: "joe@gmail.com",
        //             AdminOrganizationName: "NC",
        //             AdminCity: "CA",
        //             RegistrantFirstName: "John",
        //             RegistrantLastName: "Smith",
        //             RegistrantAddress1: "8939 S.cross Blvd",
        //             RegistrantStateProvince: "CS",
        //             RegistrantPostalCode: "90045",
        //             RegistrantCountry: "US",
        //             RegistrantPhone: " 1.6613102107",
        //             RegistrantEmailAddress: "jo@gmail.com",
        //             RegistrantOrganizationName: "NC",
        //             RegistrantCity: "CA",
        //             AddFreeWhoisguard: "no",
        //             WGEnabled: "no",
        //             GenerateAdminOrderRefId: "False",
        //             IsPremiumDomain: "False",
        //             EapFee: "0"
        //         }
        //     });
        //     xml2js.parseString(resp.data, async function (err, results) {
        //         if (results.ApiResponse.$.Status == "OK") {
        //             await User.findOneAndUpdate({ _id: userId }, {
        //                 $push: {
        //                     domains: data.order_name
        //                 }
        //             })
        //         } else {
        //             console.log(results.ApiResponse.Error);
        //             res.send(results);
        //         }
        //     });
        // },
        getUserDomains: async (req, res, next) => {
            const resp = await axios({
                method: 'get',
                url: 'https://api.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Webdomainservice',
                    ApiKey: "a50c0d969a584010be0e008abc573168",
                    UserName: 'Webdomainservice',
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
            if (req.user === undefined) return res.redirect('/signup');
            console.log(req.user)
            const resp = await axios({
                method: 'get',
                url: 'https://api.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Webdomainservice',
                    ApiKey: "a50c0d969a584010be0e008abc573168",
                    UserName: 'Webdomainservice',
                    Command: 'namecheap.domains.getList',
                    ClientIp: '122.161.72.212',
                }
            });
            xml2js.parseString(resp.data, function (err, results) {
                if (req.user === undefined) return false;
                const userDomains = req.user.domains.map(domain => domain.toLowerCase());
                const domains = results.ApiResponse.CommandResponse[0].DomainGetListResult[0].Domain.filter(domain => userDomains.includes(domain.$.Name));
                console.log(results.ApiResponse.CommandResponse[0].DomainGetListResult[0].Domain)
                return res.render('dashboard', { domains, user: req.user ?? {} })
            });

            // return res.render('dashboard', {domains: [], user: req.user ?? {}})
        },
        getDomainInfo: async (req, res) => {
            console.log(req.params.domainName);
            if (req.params.domainName == undefined) return false;
            const resp = await axios({
                method: 'get',
                url: 'https://api.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Webdomainservice',
                    ApiKey: "a50c0d969a584010be0e008abc573168",
                    UserName: 'Webdomainservice',
                    Command: 'namecheap.domains.getinfo',
                    ClientIp: '122.161.72.212',
                    DomainName: req.params.domainName
                }
            });
            let domain;
            xml2js.parseString(resp.data, function (err, results) {
                const userDomains = req.user.domains.map(domain => domain.toLowerCase());
                console.log(results.ApiResponse.CommandResponse[0].DomainGetInfoResult[0])
                if (userDomains.includes(results.ApiResponse.CommandResponse[0].DomainGetInfoResult[0].$.DomainName)) {
                    return res.render('domain', { domain: results.ApiResponse.CommandResponse[0].DomainGetInfoResult[0], user: req.user });
                } else res.send("404 error")
            });
            // return res.render('index', {domain})
        },
        setCustomDNS: async (req, res) => {
            console.log(req.body.domainName, req.body.nameserver1, req.body.nameserver2);
            console.log([req.body.nameserver1, req.body.nameserver2].join(','));
            console.log(req.body.domainName.split('.')[1]);
            if (req.body.domainName == undefined) return res.send("No Domain Name Found");
            const resp = await axios({
                method: 'post',
                url: 'https://api.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Webdomainservice',
                    ApiKey: "a50c0d969a584010be0e008abc573168",
                    UserName: 'Webdomainservice',
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