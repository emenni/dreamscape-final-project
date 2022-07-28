const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const normalizeEvent = require('./normalizer.js');
const response = require('./response.js')

exports.handler = async event => {
    try {
        const table = process.env.TABLE;
        if (!table) {
            throw new Error('No table name defined.');
        }
    
        const { data } = normalizeEvent(event);
        const params = {
            TableName: table,
            Item: {
                month: data.month,
                orderId: data.orderId,
                date: data.date,
                products: data.products
            },
        };
        await dynamo.put(params).promise();
        return response(200, `Record ${data.orderId} saved with success`);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};