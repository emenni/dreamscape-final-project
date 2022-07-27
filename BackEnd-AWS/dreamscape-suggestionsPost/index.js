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
                email: data.email,
                productId: data.productId
            },
        };
        await dynamo.put(params).promise();
        let newSuggestion = {};
        newSuggestion = await dynamo
            .get({
                TableName: table,
                Key: {
                    email: params.Item.email,
                    productId: params.Item.productId
                },
                
            })
            .promise();
        return response(200, newSuggestion);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};