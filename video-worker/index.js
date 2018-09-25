const { Pool } = require('pg');
const execSync = require('child_process').execSync;
AWS = require('aws-sdk');
let fs = require('fs');

AWS.config.update({
  region: 'us-west-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
  hostVideo: process.env.HOST_VIDEO,
});


pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

setInterval(getAndProcess, 10*60*1000);

getAndProcess();
function getAndProcess(){
  try {
    pool.connect().then(client => {
      client.query('SELECT * FROM contestsubmissions WHERE state=1 ORDER BY creation_date ASC ').then(res => {
        const rows = res.rows;
        console.log("Will process: "+rows.length);
        rows.forEach(row => {
          let initialTime = new Date().getTime();
          let sourcePath = "nfs/videos/raw/" + row.contest_id + "/" + row.video_id;
          let destPath = "nfs/videos/converted/" + row.contest_id + "/" + row.video_id;

          if (!fs.existsSync("nfs/videos/converted/" + row.contest_id) ){
            if (!fs.existsSync("nfs/videos/converted") )
              fs.mkdirSync("nfs/videos/converted");
            fs.mkdirSync("nfs/videos/converted/" + row.contest_id);
          }

          let command = "ffmpeg -i " + sourcePath + " -preset fast -c:a aac -b:a 128k " +
            "-codec:v libx264 -b:v 1000k -minrate 500k -maxrate 2000k -bufsize 2000k " +
            destPath + ".mp4 -hide_banner";
          code = execSync(command);

          let urlVideo = process.env.HOST_VIDEO + row['contest_url'];

          sendMailToUser(row['first_name'], row.email, urlVideo);


          let timeDifference = new Date().getTime() - initialTime;
          console.log("Processed in: "+ (timeDifference/1000));
          setContestAsProcessed(row.id, client);
        });
        client.release();
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
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
    Destination: { /* required */
      CcAddresses: [
        'c.hurtadoo@uniandes.edu.co',
        'lf.plazas10@uniandes.edu.co',
        /* more items */
      ],
      ToAddresses: [
        userEmail,
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
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
    Source: 'c.hurtadoo@uniandes.edu.co' /* required */
  };
  
  let sendPromise = new AWS.SES({apiVersion: '2010-12-01', correctClockSkew:true}).sendEmail(params).promise();
  sendPromise.then(data => {
      console.log(data.MessageId);
    }).catch(err => {
      console.error(err, err.stack);
    });
}

function setContestAsProcessed(contestSubmissionId, client){
  let updateCommand = 'UPDATE contestsubmissions SET state=2 WHERE id=' + contestSubmissionId;
  client.query(updateCommand).then(res => {
  }).catch(err => console.log(err));
}


