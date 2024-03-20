const { query } = require("express");
module.exports = function (User, axios, xml2js) {
    return {
        SetRouting: function (router) {
            router.get('/domain/search', this.searchDomain);
            router.get('/domain/buy', this.buyDomain);
            router.get('/user/domains', this.getUserDomains);
            router.get('/domains/list', this.listDomains);
        },
        searchDomain: async function (req, res) {
            const resp = await axios({
                method: 'get',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Prithvi0707',
                    ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                    UserName: 'Mritunjay0707',
                    Command: 'namecheap.domains.check',
                    ClientIp: '122.161.72.212',
                    DomainList: 'gameplaeyu.com'
                }
            });
            xml2js.parseString(resp.data, function (err, results) {
                // display the json data 
                return res.send(results);
            });
        },
        buyDomain: async (req, res, next) => {
            const resp = await axios({
                method: 'get',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params: {
                    ApiUser: 'Prithvi0707',
                    ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                    UserName: 'Prithvi0707',
                    Command: "namecheap.domains.create",
                    ClientIp: "122.161.72.212",
                    DomainName: "mritunjayerty.com",
                    Years: "1",
                    AuxBillingFirstName: "John",
                    AuxBillingLastName: "Smith",
                    AuxBillingAddress1: "8939 S.cross Blv",
                    AuxBillingStateProvince: "CA",
                    AuxBillingPostalCode: "90045",
                    AuxBillingCountry: "US",
                    AuxBillingPhone: " 1.6613102107",
                    AuxBillingEmailAddress: "john@gmail.com",
                    AuxBillingOrganizationName: "NC",
                    AuxBillingCity: "CA",
                    TechFirstName: "John",
                    TechLastName: "Smith",
                    TechAddress1: "8939 S.cross Blvd",
                    TechStateProvince: "CA",
                    TechPostalCode: "90045",
                    TechCountry: "US",
                    TechPhone: " 1.6613102107",
                    TechEmailAddress: "john@gmail.com",
                    TechOrganizationName: "NC",
                    TechCity: "CA",
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
                    RegistrantFirstName: "John",
                    RegistrantLastName: "Smith",
                    RegistrantAddress1: "8939 S.cross Blvd",
                    RegistrantStateProvince: "CS",
                    RegistrantPostalCode: "90045",
                    RegistrantCountry: "US",
                    RegistrantPhone: " 1.6613102107",
                    RegistrantEmailAddress: "jo@gmail.com",
                    RegistrantOrganizationName: "NC",
                    RegistrantCity: "CA",
                    AddFreeWhoisguard: "no",
                    WGEnabled: "no",
                    GenerateAdminOrderRefId: "False",
                    IsPremiumDomain: "False",
                    EapFee: "0"
                }
            });
            xml2js.parseString(resp.data, async function (err, results) {
                // display the json data 
                console.log(req.user.username);
                if(results.ApiResponse.$.Status == "OK"){
                    await User.findOneAndUpdate({_id: req.user._id}, {
                        $push: {
                            domains: "mritunjayerty.com"
                        }
                    })
                }
                return res.send(results);
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
                if(req.user === undefined) return false;
                const userDomains = req.user.domains.map(domain => domain);
                const domains = results.ApiResponse.CommandResponse[0].DomainGetListResult[0].Domain.filter(domain => userDomains.includes(domain.$.Name));
                return res.render('dashboard', {domains})
            });
        }
    }
}