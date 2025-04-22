// Import the SNSClient from AWS SDK
// This client is used to interact with Amazon SNS (Simple Notification Service)
const { SNSClient } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
});

module.exports = { snsClient };
