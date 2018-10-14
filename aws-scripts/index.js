AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

let EC2 = new AWS.EC2({apiVersion: '2016-11-15'});

const action = process.argv[2].toLowerCase();
if (action == 'nfs')
  initializeNFS()
else if (action == 'server')
  initializeServer()
else {
  console.log('Run in the following way: node index.js [nfs|server]');
  console.log('Example: node index.js nfs')
}
  
function initializeNFS(){
  let instanceParams = {
    ImageId: 'ami-0070ef629180c29d2',
    InstanceType: 't2.micro',
    KeyName: 'thirdSubmission',
    MinCount: 1,
    MaxCount: 1,
    NetworkInterfaces: [
      {
        SubnetId: 'subnet-4fb09427',
        AssociatePublicIpAddress: true,
        DeleteOnTermination: true ,
        Description: 'NFS interface',
        DeviceIndex: 0,
        Groups: [
          'sg-086801fdb53330b93',
        ],
        PrivateIpAddresses: [
          {
            Primary: true ,
            PrivateIpAddress: '172.31.0.14'
          },
        ],
      },
    ],
  };
  
  EC2.runInstances(instanceParams).promise().then(data => {
      let instanceId = data.Instances[0].InstanceId;
      console.log('Started Instance: '+instanceId);
    }).catch(
    (err) => {
      console.error(err, err.stack);
    });
}

function initializeServer(){
  let instanceParams = {
    ImageId: 'ami-04979ad09169dc1bd',
    InstanceType: 't2.micro',
    KeyName: 'thirdSubmission',
    MinCount: 1,
    MaxCount: 1,
    NetworkInterfaces: [
      {
        SubnetId: 'subnet-4fb09427',
        AssociatePublicIpAddress: true,
        DeleteOnTermination: true ,
        Description: 'NFS interface',
        DeviceIndex: 0,
        Groups: [
          'sg-086801fdb53330b93',
        ],
        PrivateIpAddresses: [
          {
            Primary: true ,
            PrivateIpAddress: '172.31.0.15'
          },
        ],
      },
    ],
  };
  
  EC2.runInstances(instanceParams).promise().then( data => {
      let instanceId = data.Instances[0].InstanceId;
      console.log('Started Instance: '+instanceId);
    }).catch(
    (err) => {
      console.error(err, err.stack);
    });
}

