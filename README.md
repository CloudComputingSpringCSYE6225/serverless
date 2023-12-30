# Lambda Function: Email Sender

This AWS Lambda function sends email notifications using Mailgun and tracks the email status in AWS DynamoDB.

## Overview

The Lambda function is triggered by an event published to an Amazon SNS topic. The SNS message includes details such as the user information

## Functionality

1. **Email Notification:** Sends an email notification about the upload status using Mailgun.
2. **Email Tracking:** Tracks the sent emails in AWS DynamoDB.

## Configuration

Before deploying the Lambda function, ensure you have configured the following environment variables:

- **MAILGUN_API_KEY:** API key for Mailgun.
- **MAILGUN_DOMAIN:** Domain associated with your Mailgun account.
- **MAILGUN_SENDER:** Sender email address for Mailgun.
- **DYNAMODB_TABLE:** Name of the DynamoDB table for tracking emails.
- **AWS_REG:** AWS region for DynamoDB.

## How to Use

1. **Deploy the Lambda Function:**
    - Deploy the Lambda function using the provided code.
    - Subscribe the Lambda function to the appropriate SNS topic.

2. **Send SNS Event:**
    - Send an SNS event with details about the upload status of image

3. **Monitor Logs:**
    - Monitor the CloudWatch Logs for the Lambda function to view execution logs.

4. **To zip it locally:**
    ```bash
    make zip
    ```