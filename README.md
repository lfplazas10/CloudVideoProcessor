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

## How to run manually

### First run the database:
Download and install [docker](https://docs.docker.com/install/#supported-platforms)

Install [docker-compose](https://docs.docker.com/compose/install/#install-compose)

Once both are installed, execute the following command on the project root directory:

```
docker-compose up
```

### Run the server:

Download and install [sbt](https://www.scala-sbt.org/1.0/docs/Setup.html)

The project requires 3 environment variables in order to run, in UNIX based systems you can set them as follows:

```
export APP_SECRET=ffd91725f5c741ddb778634dae3a0709
export DATABASE_USER=manager
export DATABASE_PASSWORD=SecurePassword123
```

After installing sbt and setting the environment variables, execute on the root directory:

```
sbt run
```

The server will be listening to requests on http://localhost:9000/
 
The first time you run the project it will tell you that the database 'Default' needs evolution, click on Apply script now.

### Run the web project:

Go into the /web directory inside the project and run:

```
npm install && npm start
```

The web project makes use of Material-UI, for reference check: https://material-ui.com/api/app-bar/

Future reference:
https://www.sample-videos.com/