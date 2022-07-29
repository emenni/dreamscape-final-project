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
            "month": pathParameters['month'],
            "orderId": pathParameters['orderId']
        }
    };

    try {
        await dynamo.delete(params, () => {}).promise();
        return response(200, `Record ${pathParameters['orderId']} has been deleted`);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};