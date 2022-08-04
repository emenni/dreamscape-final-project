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
                combination: data.combination,
                combinationId: data.combinationId,
                orderDate: data.orderDate,
                createDate: new Date().toISOString().split('T')[0],
                occurrences: data.occurrences ?? 1,
                showInShop: data.showInShop ?? false,
            },
        };
        await dynamo.put(params).promise();
        return response(200, `Record ${data.combinationId} saved with success`);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};