const normalizeEvent = require('./normalizer');
const axios = require('axios')

exports.handler = async function(event, context, callback) {        
        
    // Perform authorization to return the Allow policy for correct parameters and 
    // the 'Unauthorized' error, otherwise.
    const { headers } = normalizeEvent(event); 

     
    const authorization = headers['Proxy-Authorization'] ?? headers['proxy-authorization']
    if (authorization) {
        const responseGetUserVtex = await axios.get( `https://${process.env.account}.myvtex.com/api/vtexid/pub/authenticated/user?authToken=${authorization}`,{ // CHECK IF IS A VTEX AUTHENTICATED USER
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        const userVtex = await responseGetUserVtex.data
        
        if(await userVtex) {
            if(userVtex.user){ // ACCEPT IF HAS EMAIL
                callback(null, generateAllow(userVtex.user, event.routeArn));
            } else {
                callback(null, generateDeny(userVtex.user, event.routeArn));
            }
        } else {//DENY IF NO USER VTEX
            callback(null, generateDeny('user', event.routeArn));
        }
    }  else {// DENY IF NO AUTHORIZATION HEADER
        callback(null, generateDeny('user', event.routeArn));
    }
}
     
// Help function to generate an IAM policy.
var generatePolicy = function(principalId, effect, resource) {
    // Required output:
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = "2012-10-17"; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource =  resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        "message": effect === 'Allow' ? 'Authorized' : 'Unauthorized',
    };
    return authResponse;
}
     
var generateAllow = function(principalId, resource) {
    return generatePolicy(principalId, 'Allow', resource);
}
     
var generateDeny = function(principalId, resource) {
    return generatePolicy(principalId, 'Deny', resource);
}