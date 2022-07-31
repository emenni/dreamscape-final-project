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
        
        if(!pathParameters || !pathParameters['combination'] || !pathParameters['combinationId']){
            throw new Error('Invalid Request.');
        }
        data = await dynamo
                    .get({
                        ...params,
                        Key: {// get data that has the date requested and month
                            combination: pathParameters['combination'],
                            orderId: pathParameters['combinationId'],
                        },
                        
                    })
                    .promise();
        if(!data.Item)
           return response(404, 'Not found');
        const params = {
            TableName: table,
            Key: {
                combination: pathParameters['combination'],
                combinationId: pathParameters['combinationId']
            },
            UpdateExpression: 'set #a = :d, #f = :h, #j = :l',
            ExpressionAttributeNames: {
                '#a': 'updated_at',
                '#f': 'occurrences',
                '#j': 'showInShop'
            },
            ExpressionAttributeValues: {
                ':d': new Date().toISOString().split('T')[0],
                ':h': data.Item + (data.occurrences ?? 0),
                ':l': data.showInShop ?? false
            },
        };
        
        
        
        
        await dynamo.update(params).promise();
        
        return response(200, 'Record has been update');
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};
