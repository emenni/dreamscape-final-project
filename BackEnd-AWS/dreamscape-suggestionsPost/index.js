const uuid = require('uuid');

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const normalizeEvent = (event) => {
    return {
        method: event['requestContext']['http']['method'],
        data: event['body'] ? JSON.parse(event['body']) : {},
        querystring: event['queryStringParameters'] || {},
        pathParameters: event['pathParameters'] || {},
        headers: event['requestContext']['http']['headers'],
    };
};
const response = function (status, body) {
    return {
        statusCode: status,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    };
};

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
                combination: data.combination,
                combinationId: uuid.v4(),
                orderDate: data.orderDate,
                createDate: new Date().toISOString().split('T')[0],
                occurrences: data.occurrences ?? 1,
                showInShop: data.showInShop ?? false,
            },
        };
        await dynamo.put(params).promise();
        return response(200, `Record ${params.Item.combinationId} saved with success`);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};