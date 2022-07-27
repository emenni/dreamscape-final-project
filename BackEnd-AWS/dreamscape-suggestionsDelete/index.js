const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const normalizeEvent = require('./normalizer');
const response = require('./response');

exports.handler = async event => {
    
    const table = process.env.TABLE;
    if (!table) {
        throw new Error('No table name defined.');
    }

    const { pathParameters } = normalizeEvent(event);

    const params = {
        TableName: table,
        "Key": {
            "email": pathParameters['email'],
            "productId": pathParameters['productId']
        }
    };

    try {
        const dyn =  await dynamo.delete(params, () => {}).promise();
        return response(200, `Record ${pathParameters['productId']} has been deleted`);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};