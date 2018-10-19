const queue = require('./queue.js')
const execSync = require('child_process').execSync;

AWS = require('aws-sdk');
let ses = new AWS.SES({apiVersion: '2010-12-01', correctClockSkew:true});

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

let contestsToProcess = [];

const initProcessTime = new Date().getTime();

// setInterval(getAndProcess, parseInt(process.env.LOOP_TIME)*60*1000);

getAndProcess();
function getAndProcess(){
  try {
    queue.receiveMessage().then(data => {
      if (data == undefined) return;
      let videoId = data[0].Body;
  
      let initialTime = new Date().getTime();
      let sourcePath = 'https://s3.us-east-2.amazonaws.com/modeld-videos/raw/'+videoId;
      let destPath = 'videos/'+videoId;
  
      let command = "ffmpeg -i " + sourcePath + " -preset fast -c:a aac -b:a 128k " +
        "-codec:v libx264 -b:v 1000k -minrate 500k -maxrate 2000k -bufsize 2000k " +
        destPath + ".mp4 -hide_banner";
      code = execSync(command);
  
      let urlVideo = process.env.HOST_VIDEO + row['contest_url'];
  
      sendMailToUser(row['first_name'], row.email, urlVideo);
  
      let timeDifference = new Date().getTime() - initialTime;
      console.log("Video processed in: "+ (timeDifference/1000));
      let timeDifference2 = new Date().getTime() - initProcessTime;
      console.log("Total time passed:"+ (timeDifference2/1000));
      setContestAsProcessed(row.id, client);
    }).catch(error => {
      console.log(error)
    })
  } catch (e) {
    console.log(e);
  }
}

function sendMailToUser(userName, userEmail, urlVideo){

  let message = "Estimado(a) " + userName + ", <br/>"
    + "Le informamos que su video fue procesado exitosamente, "
    + "puede visualizarlo en el siguiente enlace: <br/>"
    + "<a href='" + urlVideo + "'> Enlace video </a>";

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
        Data: 'Notificación video concurso'
      }
    },
    Source: 'c.hurtadoo@uniandes.edu.co'
  };

  ses.sendEmail(params).promise().then(data => {
    console.log(data.MessageId);
  }).catch(err => {
    console.error(err, err.stack);
  });
}

function isContestAlreadyInQueue(row){
  return contestsToProcess.some(contest => contest.contest_id == row.contest_id);
}

function setContestAsProcessed(contestSubmissionId, client){
  let updateCommand = 'UPDATE contestsubmissions SET state=2 WHERE id=' + contestSubmissionId;
  client.query(updateCommand).then(res => {
  }).catch(err => console.log(err));
}


