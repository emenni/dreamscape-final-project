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
        if (pathParameters && pathParameters['email']) { // verify if has email
            if(pathParameters['productId']) { // verify if has productId
                data = await dynamo
                    .get({
                        ...params,
                        Key: {// get data that has the email requested and productId
                            email: pathParameters['email'],
                            productId: pathParameters['productId']
                        },
                        
                    })
                    .promise();
            } else {
                data = await dynamo
                    .query({
                          ExpressionAttributeValues: {
                            ':e': pathParameters['email'], // get data that has the email requested
                           },
                         KeyConditionExpression: 'email = :e',
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
