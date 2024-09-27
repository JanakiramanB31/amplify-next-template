import type { APIGatewayProxyHandler } from "aws-lambda";
import { AWSError } from 'aws-sdk';
import { ListUsersResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export const handler: APIGatewayProxyHandler = async (event) => {
  const AWS = require('aws-sdk');
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  console.log("event", event);
  const provider = event.requestContext.identity.cognitoAuthenticationProvider;
  let users = 'initialized';

  if (provider) {
    users = 'came inside provider';
    const sub = provider.split(':')[2];
    const Params = {
      UserPoolId: 'ap-southeast-1_bf9CiHZib', /* required */
      Filter: `sub="${sub}"`,
      Limit: 1
    };
    users = 'came after params';

    try {
      const data: ListUsersResponse = await new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.listUsers(Params, (err: AWSError, data: ListUsersResponse) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      if (data.Users && data.Users.length > 0) {
        users = JSON.stringify(data.Users);
        console.log(data.Users[0].Attributes); // successful response
      } else {
        users = "No users found";
        console.log('No users found');
      }
    } catch (err) {
      const error = err as AWSError;
      users = "Error in pool: " + error.stack;
      console.log(error, error.stack); // an error occurred
    }
  } else {
    users = "Provider error";
  }

  const data = {
    "Event": JSON.stringify(event),
    "users": users
  };

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify(data),
  };
};
