const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const normalizeEvent = require('./normalizer.js');

const response = require('./response.js');

exports.handler = async event => {

    const table = process.env.TABLE;
    
    if (!table) {
        throw new Error('No table name defined.');
    }

    const { pathParameters, querystring } = normalizeEvent(event); // get pathparameters
    console.log(querystring)

    try {
        let data = {};
        if (pathParameters && pathParameters['combination']) { // verify if has date
            if(pathParameters['combinationId']) { // verify if has month
                const params = {
                        TableName: table,
                        Key: {// get data that has the date requested and month
                            combination: pathParameters['combination'],
                            combinationId: pathParameters['combinationId'],
                        },
                        
                    }
                
                data = await dynamo
                    .get(params)
                    .promise();
            } else {
                const params = {
                        ExpressionAttributeValues: {
                            ':e': pathParameters['combination'], // get data that has the date requested
                        },
                        KeyConditionExpression: 'combination = :e',
                        TableName: table,
                    }
                
                data = await dynamo
                    .query(params)
                    .promise();
            }
        } else {
            const params = {
                TableName: table,
                BackwardSearch: true,
                FilterExpression: "occurrences >= :num",
                LastEvaluatedKey: true,
                ScanIndexForward: false,
                ExpressionAttributeValues: {
                    ":num": Number(querystring?.occurrencesMoreThan ?? '1'),
                }
            }; 
            if(querystring['pageSize']) {
                params.Limit = querystring['pageSize'] ?? 15
            }
            
            if(querystring['index']){
                params.ExclusiveStartKey = JSON.parse(querystring['index'])
            }
            if(querystring['skuId']) { //contains(#movie_name, :movie_name)
                params.FilterExpression += ", contains( combination, :combination)"
                params.ExpressionAttributeValues[":combination"] = querystring['skuId']
            }
            data = await dynamo.scan(params).promise();// get all data
        }
        
        if(!data?.Items && !data?.Item){ // check if has items or item
            return response(404, "Not Found")
        }
        if(data?.Items) {
            const sortedData = data?.Items.sort((a,b) => {
                return b.occurrences - a.occurrences
            })
            return response(200, {
                Items: sortedData,
                Count: data.Count,
                ScannedCount: data.ScannedCount,
                LastEvaluatedKey: data.LastEvaluatedKey
            });
        }
        return response(200, data);
    } catch (err) {
        console.log(err);
        return response(500, 'Somenthing went wrong');
    }
};
