const QUEUE_URL = "https://sqs.us-east-2.amazonaws.com/306743161273/videos.fifo";
AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let params = {
  AttributeNames: [
    "SentTimestamp"
  ],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
    "All"
  ],
  QueueUrl: QUEUE_URL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0
};

sqs.receiveMessage(params).promise().then(data => {
  console.log(data.Messages);
  let deleteParams = {
    QueueUrl: QUEUE_URL,
    ReceiptHandle: data.Messages[0].ReceiptHandle
  };
  sqs.deleteMessage(deleteParams).promise().then(data => {
  
  }).catch(err => {
    console.log("Delete Error", err);
  })
}).catch(err => {
  console.log("Receive Error", error);
});
