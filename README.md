[<img src="https://img.shields.io/travis/playframework/play-java-starter-example.svg"/>](https://travis-ci.org/playframework/play-java-starter-example)

# Contest manager app


## 1. How to run on any IaaS provider

Download and install [docker](https://docs.docker.com/install/#supported-platforms)

Install [docker-compose](https://docs.docker.com/compose/install/#install-compose)

Create a .env file containing all the necessary env vars. E.g.

```
# Vars necessary for server:
APP_SECRET=ffd91725f5c741ddb778634dae3a0709
DATABASE_USER=manager
DATABASE_PASSWORD=SecurePassword123
DATABASE_URL=jdbc:postgresql://contestdb.cffc4pvc.us-east-2.rds.amazonaws.com:5432/postgres
EMAIL_USER=email1
EMAIL_PASS=Pass2
NFS_IP=18.223.240.69
# Vars necessary for video-worker
DATABASE_USER=manager
DATABASE_HOST=contestdb.cffc4pvc.us-east-2.rds.amazonaws.com
DATABASE_NAME=postgres
DATABASE_PASSWORD=Password
NFS_IP=18.223.240.69
# No env variables are required for the nfs server 
```

After the .env is created, execute the following command on the project root directory:

```
docker-compose up -d service_name
```
Where service name is either server, worker or nfs.
For more info on open ports and general conf take a look at the docker-compose.yml file.

## 2. How to run locally 

Follow the same steps as in the  1st step, you only need docker, docker-compose and configuring the .env file.

## 3. How to run locally (development)

### Run the server:

Install Java [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 

Install [sbt](https://www.scala-sbt.org/1.0/docs/Setup.html)

The project requires 5 environment variables in order to run, [click here](http://www.dowdandassociates.com/blog/content/howto-set-an-environment-variable-in-windows-command-line-and-registry/) to see how to export them in Windows, in UNIX based systems you can set them as follows:

```
export APP_SECRET=ffd91725f5c741ddb778634dae3a0709
export DATABASE_USER=manager
export DATABASE_PASSWORD=SecurePassword123
export DATABASE_URL=jdbc:postgresql://contestdb.cffc3klf4pvc.us-east-2.rds.amazonaws.com:5432/postgres
export NFS_IP=12.42.42.42
```

After installing sbt and setting the environment variables, execute on the root directory:

```
sbt run
```

The server will be listening to requests on http://localhost:9000/
 
The first time you run the project it will tell you that the database 'Default' needs evolution, click on Apply script now.

### Run the web project:

Install [Node and NPM](https://www.npmjs.com/get-npm)

Go into the /web directory and run:

```
npm install && npm start
```

The web project makes use of Material-UI, for reference check: https://material-ui.com/api/app-bar/

### Run the worker:

This project also requires [Node and NPM](https://www.npmjs.com/get-npm).

The project requires 5 environment variables in order to run, [click here](http://www.dowdandassociates.com/blog/content/howto-set-an-environment-variable-in-windows-command-line-and-registry/) to see how to export them in Windows, in UNIX based systems you can set them as follows:

```
export DATABASE_USER=manager
export DATABASE_HOST=contestdb.cffc4pvc.us-east-2.rds.amazonaws.com
export DATABASE_NAME=postgres
export DATABASE_PASSWORD=Password
export NFS_IP=18.223.240.69
```

Go into the /video-worker directory and run:

```
npm install && node index.js
```

