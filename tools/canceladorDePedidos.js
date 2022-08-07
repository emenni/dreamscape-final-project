const axios = require("axios");
const orderData = require('./cancelarPedidos.json')

    async function enviarPedido() {

        orderData.Orders.forEach(async (record) => {


            let response = await axios.post(`https://dreamscape.vtexcommercestable.com.br/api/oms/pvt/orders/${record.orderId}/cancel`,{},
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-VTEX-API-AppKey': 'vtexappkey-dreamscape-KARBSE',
                    'X-VTEX-API-AppToken': 'OGAJZINNXDAIJRRATDIADXZQRWVLYXAVJVCVSWEBOUNZYWHDAAOUDZPBWVNSYDPZBHITVVGDEVDVQQKHHDQUEYHSFGKVHUYQVRZYACYIFZNEMUZCBFYXKYRFOBWSMKYJ'
                },
                            
                })

            console.log('STATUS DA REQUISICAO:', record.orderId, response.data)

        })

    }

    enviarPedido() 


