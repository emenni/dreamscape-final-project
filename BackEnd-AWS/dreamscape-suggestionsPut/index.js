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
    
        const { data, pathParameters } = normalizeEvent(event);
        
        if(!pathParameters || !pathParameters['combination'] || !pathParameters['combinationId']){
            throw new Error('Invalid Request.');
        }
        const dataOldCombination = await dynamo
                    .get({
                        TableName: table,
                        Key: {// get data that has the date requested and month
                            combination: pathParameters['combination'],
                            combinationId: pathParameters['combinationId'],
                        },
                        
                    })
                    .promise();
        if(!dataOldCombination.Item)
           return response(404, 'Not found');
        const params = {
            TableName: table,
            Key: {
                combination: pathParameters['combination'],
                combinationId: pathParameters['combinationId']
            },
            UpdateExpression: 'set #a = :d, #f = :h',
            ExpressionAttributeNames: {
                '#a': 'updated_at',
                '#f': 'occurrences'
            },
            ExpressionAttributeValues: {
                ':d': new Date().toISOString().split('T')[0],
                ':h': dataOldCombination.Item.occurrences + (data?.occurrences ?? 0)
            },
        };
        if(data?.showInShop !== undefined) {
            params.UpdateExpression = params.UpdateExpression + ', #j = :l'
            params.ExpressionAttributeNames['#j'] = 'showInShop'
            params.ExpressionAttributeValues[':l'] = data.showInShop ?? dataOldCombination.Item.showInShop ?? false
        }
        
        
        await dynamo.update(params).promise();
        
        return response(200, 'Record has been update');
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};
