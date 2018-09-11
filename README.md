[<img src="https://img.shields.io/travis/playframework/play-java-starter-example.svg"/>](https://travis-ci.org/playframework/play-java-starter-example)

# Contest manager app


## How to run on any IaaS provider

Download and install [docker](https://docs.docker.com/install/#supported-platforms)

Install [docker-compose](https://docs.docker.com/compose/install/#install-compose)

Create a .env file containing all the necessary env vars. E.g.

```
APP_SECRET=ffd91725f5c741ddb778634dae3a0709
DATABASE_USER=manager
DATABASE_PASSWORD=SecurePassword123
DATABASE_URL=jdbc:postgresql://postgres:5432/postgres
EMAIL_USER=email1
EMAIL_PASS=Pass2
```


Execute the following command on the project root directory:

```
docker-compose up
```
That's it :)

Want to run only one service? Run:

```
docker-compose up postgres
```
or
```
docker-compose up server
```

The web project makes use of Material-UI, for reference check: https://material-ui.com/api/app-bar/

Future reference:
https://www.sample-videos.com/