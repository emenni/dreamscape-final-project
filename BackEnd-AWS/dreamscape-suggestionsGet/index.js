const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const normalizeEvent = require('./normalizer.js');

const response = require('./response.js');

exports.handler = async event => {

    const table = process.env.TABLE;
    if (!table) {
        throw new Error('No table name defined.');
    }

    const { pathParameters } = normalizeEvent(event); // get pathparameters
    const params = {
        TableName: table,
    };

    try {
        let data = {};
        if (pathParameters && pathParameters['combination']) { // verify if has date
            if(pathParameters['combinationId']) { // verify if has month
                data = await dynamo
                    .get({
                        ...params,
                        Key: {// get data that has the date requested and month
                            combination: pathParameters['combination'],
                            orderId: pathParameters['combinationId'],
                        },
                        
                    })
                    .promise();
            } else {
                data = await dynamo
                    .query({
                          ExpressionAttributeValues: {
                            ':e': pathParameters['combination'], // get data that has the date requested
                           },
                         KeyConditionExpression: 'combination = :e',
                         TableName: table,
                    })
                    .promise();
            }
        } else {
            data = await dynamo.scan(params).promise();// get all data
        }
        
        
        if(!data?.Items && !data?.Item){ // check if has items or item
            return response(404, "Not Found")
        }
        return response(200, data);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};
