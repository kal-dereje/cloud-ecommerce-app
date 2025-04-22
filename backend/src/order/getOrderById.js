const { APIGatewayProxyHandler } = require("aws-lambda");
const { docClient } = require("../shared/dynamodbClient");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");

exports.handler = async (event) => {
  // const dynamoDBClient = new DynamoDBClient({
  //   region: process.env.AWS_REGION || "us-east-1",
  // });
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    const orderId = event.pathParameters?.id;
    if (!userId || !orderId) throw new Error("Missing parameters");

    const result = await docClient.send(
      new GetCommand({
        TableName: process.env.ORDERS_TABLE,
        Key: {
          userId,
          orderId,
        },
      })
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
