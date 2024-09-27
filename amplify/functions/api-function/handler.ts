import type { APIGatewayProxyHandler } from "aws-lambda";
import { AWSError } from 'aws-sdk';
import { ListUsersResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
export const handler: APIGatewayProxyHandler = async (event, req, res) => {
  const AWS = require('aws-sdk');
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  console.log("event", event);
  const provider = event.requestContext.identity.cognitoAuthenticationProvider;
  if (provider) {
    const sub = provider.split(':')[2];
    const Params = {
      UserPoolId: 'xxxxxxxxx', /* required */
      Filter: "sub=\""+ sub + "\"",
      Limit: 1
    };
    cognitoidentityserviceprovider.listUsers(Params, function(err : AWSError, data: ListUsersResponse) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else if (data.Users && data.Users.length > 0) {
        console.log(data.Users[0].Attributes); // successful response
      } else {
        console.log('No users found');
      }
    });
  } 
  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    
    body: JSON.stringify(event),
  };
};