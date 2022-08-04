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
        if(typeof data?.combination !== "string" || !data?.combination) {
            return response(400, `${data?.combination} is invalid`);
        }
        
        let combinations = data?.combination.split(',')
        
        const combinationsFiltered = []
        combinations.map((v) => { 
            let value = v
            if(typeof value === "number"){
              value = value.toString()
            } 
            if(typeof value === "string"){
              value = value.replace(/[^0-9]+/g,undefined)
            }else {
              value = undefined
            }
            if(typeof value !== "undefined" && !Number.isNaN(parseInt(value,10))){
              combinationsFiltered.push(parseInt(value,10))
            }
            return true
        });
        if(combinationsFiltered.length <= 1){
            return response(400, `${data?.combination} is invalid`);
        }
        const checkCombinationsIds = [...new Set(combinationsFiltered)]
        if(checkCombinationsIds.length !== combinationsFiltered.length) {
            return response(400, `${data?.combination} is invalid`);
        }
        data.combination = combinationsFiltered.sort((a, b) => {
            return a - b
        }).join(',');
        const checkCombination = await dynamo
                .query({
                    ExpressionAttributeValues: {
                        ':e': data?.combination, // get data that has the date requested
                    },
                    KeyConditionExpression: 'combination = :e',
                    TableName: table,
                })
                .promise();
        if(checkCombination?.Items?.length > 0  || checkCombination?.Item?.length > 0){
            return response(400, `Record ${checkCombination?.Items ?? checkCombination?.Item} already exists`);
        }
        const params = {
            TableName: table,
            Item: {
                combination: data.combination,
                combinationId: uuid.v4(),
                orderDate: data?.orderDate ?? null,
                createDate: new Date().toISOString().split('T')[0],
                occurrences: Number.isNaN(Number(data.occurrences)) === true ? 0 : Number(data.occurrences),
                showInShop: typeof data?.showInShop == "boolean" ? data?.showInShop : false,
            },
        };
        await dynamo.put(params).promise();
        return response(200, `Record ${params.Item.combinationId} saved with success`);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};