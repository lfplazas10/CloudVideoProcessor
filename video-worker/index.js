const { Client } = require('pg');
const execSync = require('child_process').execSync;
let fs = require('fs');
const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

// let interval = setInterval(getAndProcess, 2000);
getAndProcess();
function getAndProcess(){
  try {
    client.connect(() => {
      client.query('SELECT * FROM contestsubmissions WHERE state=1', (err, res) => {
        console.log(res)
        const rows = res.rows;
        console.log(rows.length)
        rows.forEach(row => {
          let initialTime = new Date().getTime();
        
          let sourcePath = "nfs/videos/raw/" + row.contest_id + "/" + row.video_id;
          let destPath = "nfs/videos/converted/" + row.contest_id + "/" + row.video_id;
          if (!fs.existsSync("nfs/videos/converted/" + row.contest_id) ){
            fs.mkdirSync("nfs/videos/converted");
            fs.mkdirSync("nfs/videos/converted/" + row.contest_id);
          }
          
          let command = "ffmpeg -i " + sourcePath + " -preset fast -c:a aac -b:a 128k " +
            "-codec:v libx264 -b:v 1000k -minrate 500k -maxrate 2000k -bufsize 2000k " +
            destPath + ".mp4 -hide_banner";
          code = execSync(command);
        
          let updateCommand = 'UPDATE contestsubmissions SET state=2 WHERE id =' + row.id;
        
          let timeDifference = new Date().getTime() - initialTime;
          console.log("Processed in: "+ (timeDifference/1000));
          client.query(updateCommand);
        });
        client.end();
      });
    });
  } catch (e) {
    console.log(e);
  }
}


