[<img src="https://img.shields.io/travis/playframework/play-java-starter-example.svg"/>](https://travis-ci.org/playframework/play-java-starter-example)

# Contest manager app


## How to run on any IaaS provider

Download and install [docker](https://docs.docker.com/install/#supported-platforms)

Install [docker-compose](https://docs.docker.com/compose/install/#install-compose)

Create a .env file containing all the necessary env vars. E.g.

```
# Vars necessary for server:
APP_SECRET=ffd91725f5c741ddb778634dae3a0709
DATABASE_USER=manager
DATABASE_PASSWORD=SecurePassword123
DATABASE_URL=jdbc:postgresql://postgres:5432/postgres
EMAIL_USER=email1
EMAIL_PASS=Pass2
# Vars necessary for video-worker
DATABASE_USER=manager
DATABASE_HOST=contestdb.cffc3klf4pvc.us-east-2.rds.amazonaws.com
DATABASE_NAME=postgres
DATABASE_PASSWORD=SecurePassword123
```


Execute the following command on the project root directory:

```
docker-compose up service_name
```

Replace service_name by one of the following: server, nfs, worker. For more info on open ports and general conf take a look at the docker-compose.yml file.

The web project makes use of Material-UI, for reference check: https://material-ui.com/api/app-bar/
