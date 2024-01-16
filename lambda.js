import dotenv from "dotenv"
dotenv.config()
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";

export const handler = async(event) => {
    try {
        // fetch is available with Node.js 18
        console.log("Event in lambda: ", event)
        // const sns_message = event
        const sns_message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)))
        const image_path = sns_message["image_path"]
        const image_name = sns_message["image_name"]
        const user_email = sns_message["user_email"]
        const status = sns_message["status"]
        const message = sns_message["message"]

        if(status)
            await email("Your file has been uploaded successfully: "+image_name+" at "+image_path, user_email)
        else
            await email(message, user_email)
    }
    catch (e) {
        console.error(e);
    }
}

const email = async (message, user_email)=>{
    const API_KEY = process.env.MAILGUN_API_KEY;
    const DOMAIN = process.env.MAILGUN_DOMAIN;
    const SENDER = process.env.MAILGUN_SENDER;

    const mailgun = new Mailgun(formData);
    const client = mailgun.client({username: 'api', key: API_KEY});

    const subject = "Upload Status Notification"
    const body = "The status of your upload is: \n\n"+ message+ "\n\nThanks, \nRebecca Biju"

    const messageData = {
        from: SENDER,
        to: user_email,
        subject: subject,
        text: body
    };

    await client.messages.create(DOMAIN, messageData)
        .then(async (res) => {
            console.log("Email sent successfully to ", user_email);
            await track_email(process.env.DYNAMODB_TABLE, user_email, body)
        })
        .catch((err) => {
            console.error("Failed to send email. Error -", err);
        });
}

const track_email = async (table_name, user_email, message)=>{
    try{
        const client = new DynamoDBClient({ region: process.env.AWS_REG });
        const input = {
            TableName: table_name,
            Item: {
                id: {N : Date.now()},
                UserEmail: {S: user_email},
                Timestamp: {N: Date.now()},
                Message: {S: message}
            }
        }
        const command = new PutItemCommand(input);
        const response = await client.send(command);
        console.log(response)
    }
    catch(err){
        console.log("Error while tracking mail: ", err)
        await email(err, user_email)
    }
}

// const data = {
//     "image_path": "ksd",
//     "image_name": "asd",
//     "message": "asd",
//     "status": true,
//     "user_email": "mahajanvaibhav5155@gmail.com"
// }
//
// handler(data)