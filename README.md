# Twitter Recommendation system

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

TO setup the project on your local machine do the following
Install Node

```
npm install node
```

Install Postgres

```
[Postgres](http://www.postgresqltutorial.com/install-postgresql/)
```

Clone the repo by running

```
git clone https://github.com/luc-tuyishime/twitter-recommendation.git
```

Then install all the necessary dependencies

```
npm install
```

## Database setup

Creata a .env file

Copy and Paste the DB variables

```

## Deployment

* DEV_USER=username
* DEV_PASSWORD=password
* DEV_DATABASE=databaseName
* DEV_HOST=localhost
* NODE_ENV=dev
PORT=

```

## Run the application

```

npm run dev

```

### Perform ETL

`POST http://localhost:4000/api/v1/etl/perform`

Example request body In Postman:

form-data

```

filePath: "File"

```
