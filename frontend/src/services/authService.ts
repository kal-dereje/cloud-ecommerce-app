import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "../awsCongif";

// Add this below loginUser
export function signUpUser(
    username: string,
    password: string,
    email: string
  ): Promise<any> {
    const attributeList = [
      {
        Name: "email",
        Value: email,
      },
    ];
  
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
    });
  
    return new Promise((resolve, reject) => {
      userPool.signUp(
        username,
        password,
        attributeList.map((attr) => new AmazonCognitoIdentity.CognitoUserAttribute(attr)),
        [],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
  