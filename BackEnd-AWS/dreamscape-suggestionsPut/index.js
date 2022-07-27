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
    
        const { pathParameters } = normalizeEvent(event);
        
        if(!pathParameters || !pathParameters['email'] || !pathParameters['productId']){
            throw new Error('Invalid Request.');
        }
        const params = {
            TableName: table,
            Key: {
                email: pathParameters['email'],
                productId: pathParameters['productId']
            },
            UpdateExpression: 'set #a = :d',
            ExpressionAttributeNames: {
                '#a': 'updated_at',
            },
            ExpressionAttributeValues: {
                ':d': new Date().toISOString()
            },
        };
        
        
        
        
        await dynamo.update(params).promise();
        
        return response(200, 'Record has been update');
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};
