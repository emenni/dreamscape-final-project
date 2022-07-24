
const axios = require("axios").default;
const orderData = require('./order.json')
const paymentData = require('./payment.json')

function setOptions (method,url,json,cookie){
    return  {
        method: method,
        url: url,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-PROVIDER-API-AppKey': '',
            'X-VTEX-API-AppKey': '',
            'X-PROVIDER-API-AppToken': '',
                'X-VTEX-API-AppToken': '',
                'Cookie': cookie ? cookie : ''
        },
        data: json ? json : {}
    };
    
}

//orderForm

(async function enviarPedido() {       

    
let orderJsonData = JSON.stringify(orderData)

    const { headers , data :{transactionData:{merchantTransactions} } , data :{ orders } } = await axios.request(setOptions('PUT','https://dreamscape.vtexcommercestable.com.br/api/checkout/pub/orders',orderJsonData));


paymentData[0].transaction.id = merchantTransactions[0].transactionId;  
let paymentJsonData = JSON.stringify(paymentData)      

console.log ('transactionID->',merchantTransactions[0].transactionId)
await axios.request(setOptions('POST',`https://dreamscape.vtexpayments.com.br/api/pub/transactions/${merchantTransactions[0].transactionId}/payments`,paymentJsonData));

console.log('orderGroup->',orders[0].orderGroup)
console.log('setCookie->',headers['set-cookie'][0].split(';')[0])
await axios.request(setOptions('POST',`https://dreamscape.vtexcommercestable.com.br/api/checkout/pub/gatewayCallback/${orders[0].orderGroup}`,'',headers['set-cookie'][0].split(';')[0]));

})()

//orderPayment
//


    //console.log({paymentData})



