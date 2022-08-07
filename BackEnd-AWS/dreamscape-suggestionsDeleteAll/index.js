const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const normalizeEvent = require('./normalizer');
const response = require('./response');

exports.handler = async event => {
    
    const table = process.env.TABLE;
    if (!table) {
        throw new Error('No table name defined.');
    }

    let data = {};
    const params = {
        TableName: table
    };

    try {
        data = await dynamo.scan(params).promise();
        if(await data?.Items?.length > 0) {
            data?.Items.map( async (item) => {
                let paramsDelete = {
                    TableName: table,
                    "Key": {
                        "combination": item['combination'],
                        "combinationId": item['combinationId']
                    }
                };
                
                
                await dynamo.delete(paramsDelete, function(err, data) {
                    if (err) {
                        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
                    }
                })
            });
        }
        return response(200, `Database has been restore`);
    } catch (err) {
        console.error(err);
        return response(500, 'Somenthing went wrong');
    }
};