const queue = require('./queue.js')
const execSync = require('child_process').execSync;
const initProcessTime = new Date().getTime();

AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

let ses = new AWS.SES({apiVersion: '2010-12-01', correctClockSkew:true});
let s3 = new AWS.S3();
let docClient = new AWS.DynamoDB.DocumentClient();
let fs = require('fs');

setInterval(getAndProcess, parseInt(process.env.LOOP_TIME)*1000);

// getAndProcess();
function getAndProcess(){
  try {
    queue.receiveMessage().then(data => {
      if (data == undefined) return;
      let videoId = data[0].Body;
      let attributes = data[0].MessageAttributes;
      let initialTime = new Date().getTime();
      let sourcePath = 'https://s3.amazonaws.com/smarttools-videos/raw/'+videoId;
      let destPath = 'videos/'+videoId+'.mp4';

      let command = "ffmpeg -i " + sourcePath + " -preset fast -c:a aac -b:a 128k " +
        "-codec:v libx264 -b:v 1000k -minrate 500k -maxrate 2000k -bufsize 2000k " +
        destPath + " -hide_banner";
      code = execSync(command);

      let urlVideo = process.env.HOST_VIDEO + attributes.contestUrl.StringValue;
      
      saveProcessedVideoS3(destPath, videoId).then(data => {
        setContestAsProcessed(attributes.id.StringValue);
        sendMailToUser(attributes.email.StringValue, urlVideo);
      }).catch(error => {
        throw error;
      });
      
      logTimes(initialTime);
    }).catch(error => {
      console.log('Failing here');
      console.log(error)
    })
  } catch (e) {
    console.log(e);
  }
}

function saveProcessedVideoS3(videoPath){
  return new Promise((resolve, reject) => {
    fs.readFile(videoPath, function (err, data) {
      if (err) throw err;
      console.log(data);
      let params = {
        ACL: "public-read",
        Body: data,
        Bucket: "smarttools-videos/converted",
        Key: videoPath.split('/')[1]
      };
      s3.putObject(params).promise().then(data => {
        resolve();
      }).catch(error => {
        console.log(error)
        reject(error);
      });
    });
  });
}

function sendMailToUser(userEmail, urlVideo){
  let message = "Dear client <br/>"
    + "Your video has been processed successfully! You can now watch it by clicking on the following link:<br/>"
    + "<a href='" + urlVideo + "'> Video link </a> <br/><br/>"
    + "Your Smart Tools Team";

  let params = {
    Destination: {
      CcAddresses: [ 'lf.plazas10@uniandes.edu.co'],
      ToAddresses: [ userEmail ]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Video notification'
      }
    },
    Source: 'lf.plazas10@uniandes.edu.co'
  };

  ses.sendEmail(params).promise().then(data => {
    console.log(data.MessageId);
  }).catch(err => {
    console.error(err, err.stack);
  });
}

function setContestAsProcessed(contestSubmissionId) {
  return new Promise ((resolve, reject) => {
    let params = {
      TableName: 'ContestSubmissions',
      Key:{ "id": contestSubmissionId },
      UpdateExpression: "set stateText = :s",
      ExpressionAttributeValues:{ ":s": "Processed" },
      ReturnValues:"UPDATED_NEW"
    };
    
    docClient.update(params).promise().then(data => {
      resolve();
    }).catch(error => {
      console.error("Unable to update item. Error JSON:", JSON.stringify(error, null, 2));
      reject(error);
    });
  });
}

function deleteLocalVideo(videoPath){
  fs.unlink(videoPath);
}

function logTimes(initialTime){
  let timeDifference = new Date().getTime() - initialTime;
  console.log("Video processed in: "+ (timeDifference/1000));
  let timeDifference2 = new Date().getTime() - initProcessTime;
  console.log("Total time passed:"+ (timeDifference2/1000));
}
