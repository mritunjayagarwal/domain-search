const { query } = require("express");
module.exports = function(axios, xml2js){
    return {
        SetRouting: function(router){
            router.get('/search/domain', this.searchDomain);
        },
        searchDomain: async function(req, res){
            const resp = await axios({
                method: 'get',
                url: 'https://api.sandbox.namecheap.com/xml.response',
                params:{
                    ApiUser: 'Prithvi0707',
                    ApiKey: "23155f2f37ca4ccba99b8962c78cb028",
                    UserName: 'Prithvi0707',
                    Command: 'namecheap.domains.check',
                    ClientIp: '122.161.72.212',
                    DomainList: 'gameplaeyu.com'
                }
            });
            xml2js.parseString(resp.data, function (err, results) { 
  
                // parsing to json 
                let data1 = JSON.stringify(results) 
                  
                // display the json data 
                return res.send(results); 
            });
        },
    }
}