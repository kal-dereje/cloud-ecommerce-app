import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamoDBClient } from "../shared/dynamodbClient";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const result = await dynamoDBClient.send(new ScanCommand({
      TableName: process.env.USERS_TABLE
    }));

    const users = result.Items?.map(item => ({
      userId: item.userId.S,
      email: item.email.S,
      role: item.role.S,
      joinedAt: item.joinedAt.S,
      preferredCategories: item.preferredCategories?.L?.map(v => v.S)
    })) || [];

    return {
      statusCode: 200,
      body: JSON.stringify({ users }),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
