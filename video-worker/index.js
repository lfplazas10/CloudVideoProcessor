const { Client } = require('pg');
const execSync = require('child_process').execSync;

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

let interval = setInterval(getAndProcess, 2000);

function getAndProcess(){
  client.connect(() => {
    client.query('SELECT * FROM contestsubmissions WHERE state=2', (err, res) => {
      const rows = res.rows;
      console.log(rows)
      rows.forEach(row => {
        let initialTime = new Date.getTime();
        
        let videoPath = "videos/"+row.contest_id+"/"+row.video_id;
        let command = "ffmpeg -i " + videoPath + " -preset fast -c:a aac -b:a 128k " +
          "-codec:v libx264 -b:v 1000k -minrate 500k -maxrate 2000k -bufsize 2000k " +
          videoPath + ".mp4 -hide_banner";
        code = execSync(command);
        
        let updateCommand = 'UPDATE contestsubmissions SET state=1 WHERE id ='+row.id;
        
        let timeDifference = new Date.getTime() - initialTime;
        console.log(timeDifference)
        client.query(updateCommand);
      });
      client.end();
    });
  });
}


