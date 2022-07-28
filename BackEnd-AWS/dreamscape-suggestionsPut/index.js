const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const normalizeEvent = require('./normalizer');
const response = require('./response');

exports.handler = async event => {
    const table = process.env.TABLE;
    

    try {
        
        if (!table) {
            throw new Error('No table name defined.');
        }
    
        const { data,pathParameters } = normalizeEvent(event);
        
        if(!pathParameters || !pathParameters['month'] || !pathParameters['orderId']){
            throw new Error('Invalid Request.');
        }
        const params = {
            TableName: table,
            Key: {
                month: pathParameters['month'],
                orderId: pathParameters['orderId']
            },
            UpdateExpression: 'set #a = :d, #f = :h',
            ExpressionAttributeNames: {
                '#a': 'updated_at',
                '#f': 'products'
            },
            ExpressionAttributeValues: {
                ':d': new Date().toISOString(),
                ':h': data.products
            },
        };
        
        
        
        
        await dynamo.update(params).promise();
        
        return response(200, 'Record has been update');
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};
