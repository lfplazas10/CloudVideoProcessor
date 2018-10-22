AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

let EC2 = new AWS.EC2({apiVersion: '2016-11-15'});

const action = process.argv[2].toLowerCase();
if (action == 'nfs')
  initializeNFS()
else if (action == 'serverc')
  initializeServerC()
else if (action == 'workerc')
  initializeWorkerC()
else if (action == 'serverd')
  initializeServerD()
else {
  console.log('Run in the following way: node index.js [nfs|server]');
  console.log('Example: node index.js nfs')
}
  
function initializeNFS(){
  let instanceParams = {
    ImageId: 'ami-0011fdb09b5226987',
    KeyName: "nfs-instance",
    InstanceType: 't2.micro',
    KeyName: '3s',
    MinCount: 1,
    MaxCount: 1,
    NetworkInterfaces: [
      {
        SubnetId: 'subnet-b94bcade',
        AssociatePublicIpAddress: true,
        DeleteOnTermination: true ,
        Description: 'NFS interface',
        DeviceIndex: 0,
        Groups: [
          'sg-07233ff5b6ad214da',
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
  
  runInstance(instanceParams);
}

function initializeServerC(){
  let instanceParams = {
    ImageId: 'ami-014d508c45a715c2f',
    InstanceType: 't2.micro',
    KeyName: '3s',
    MinCount: 1,
    MaxCount: 1,
    NetworkInterfaces: [
      {
        SubnetId: 'subnet-b94bcade',
        AssociatePublicIpAddress: true,
        DeleteOnTermination: true ,
        Description: 'Server C interface',
        DeviceIndex: 0,
        Groups: [
          'sg-07233ff5b6ad214da',
        ]
      },
    ],
  };
  
  runInstance(instanceParams);
}

function initializeWorkerC(){
  let instanceParams = {
    ImageId: 'ami-0a222bfe38fd413d5',
    InstanceType: 't2.micro',
    KeyName: '3s',
    MinCount: 1,
    MaxCount: 1,
    NetworkInterfaces: [
      {
        SubnetId: 'subnet-b94bcade',
        AssociatePublicIpAddress: true,
        DeleteOnTermination: true ,
        Description: 'Server C interface',
        DeviceIndex: 0,
        Groups: [
          'sg-07233ff5b6ad214da',
        ]
      },
    ],
  };
  
  runInstance(instanceParams);
}

function initializeServerD(){
  let instanceParams = {
    ImageId: 'ami-018086fef8ae9a512',
    InstanceType: 't2.micro',
    KeyName: '3s',
    MinCount: 1,
    MaxCount: 1,
    NetworkInterfaces: [
      {
        SubnetId: 'subnet-b94bcade',
        AssociatePublicIpAddress: true,
        DeleteOnTermination: true ,
        Description: 'Server D server',
        DeviceIndex: 0,
        Groups: [
          'sg-07233ff5b6ad214da',
        ]
      },
    ],
  };
  
  runInstance(instanceParams);
}

function runInstance(instanceParams){
  EC2.runInstances(instanceParams).promise().then( data => {
    let instanceId = data.Instances[0].InstanceId;
    console.log('Started Instance: '+instanceId);
  }).catch(
    (err) => {
      console.error(err, err.stack);
    });
}

