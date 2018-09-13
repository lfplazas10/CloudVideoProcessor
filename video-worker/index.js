const { Pool, Client } = require('pg')
const execSync = require('child_process').execSync;
let fs = require('fs');

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

getAndProcess();
function getAndProcess(){
  try {
    pool.connect().then(client => {
      client.query('SELECT * FROM contestsubmissions WHERE state=1 ORDER BY creation_date DESC').then(res => {
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
          
          let timeDifference = new Date().getTime() - initialTime;
          console.log("Processed in: "+ (timeDifference/1000));
          setContestAsProcessed(row.id, client);
        });
        client.release();
      }).catch(err => console.log(err));
    });
  } catch (e) {
    console.log(e);
  }
}

function setContestAsProcessed(contestSubmissionId, client){
  let updateCommand = 'UPDATE contestsubmissions SET state=2 WHERE id=' + contestSubmissionId;
  client.query(updateCommand).then(res => {
  }).catch(err => console.log(err));
}


