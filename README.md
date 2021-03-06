[![Build Status](https://travis-ci.org/CodeForBaltimore/Bmore-Responsive.svg?branch=master)](https://travis-ci.org/CodeForBaltimore/Bmore-Responsive) [![codecov](https://codecov.io/gh/CodeForBaltimore/Bmore-Responsive/branch/master/graph/badge.svg)](https://codecov.io/gh/CodeForBaltimore/Bmore-Responsive)

# Bmore Responsive
An API to drive disaster and emergency response systems.

<!-- TOC -->

- [Bmore Responsive](#bmore-responsive)
  - [Documentation](#documentation)
    - [API Spec](#api-spec)
    - [Database Documentation](#database-documentation)
    - [Infrastructure and Deployment](#infrastructure-and-deployment)
- [Setup](#setup)
  - [Node and Express setup](#node-and-express-setup)
  - [Environment variables](#environment-variables)
    - [Example .env](#example-env)
  - [PostgreSQL](#postgresql)
    - [Sequelize](#sequelize)
  - [Docker](#docker)
    - [docker-compose](#docker-compose)
- [Using this product](#using-this-product)
  - [Testing](#testing)
- [Sources and Links](#sources-and-links)
  - [Contributors ✨](#contributors-)

<!-- /TOC -->

## Documentation
Detailed documents describing this project and its use are available in this repository. The documentation currently available is as follows:
-   [Best Practices](/docs/Best_Practices.md)
-   [Code of Conduct](/docs/Code_of_Conduct.md)
-   [Sequelize](/sequelize/README.md)
-   [Tech Spec](/docs/Tech_Spec.md)
-   [Terraform](/terraform/README.md)

### API Spec
Our API spec is on Swagger. You can view it here https://app.swaggerhub.com/apis/codeforbaltimore/bmoreResponsive or you can find the `swagger.json` file in our `docs` folder and use it via http://localhost:3000/api-docs/ when the app is running locally.  

### Database Documentation
Our database documentation can be found in the `/sequelize` directory or you can [click here](/sequelize/README.md)

### Infrastructure and Deployment
We have included a `terraform` option to deploy to AWS. For more information on how to use this feature, please see the [terraform](/terraform/README.md) directory.

# Setup
This setup section will focus on setting up the local dev environment. For more detailed instructions for how to deploy this to a production environment please see the section above this one :point_up:

To work on this project you should have:
-   [Node.js](https://nodejs.org/en/)
-   [PostgreSQL](https://www.postgresql.org/) (can be in Docker)
-   [Docker](https://www.docker.com/) (optional)
-   [Terraform](https://www.terraform.io/) (optional, for AWS deploy)
Once you have the prerequisite software installed you can proceed to setup this application.

A `Dockerfile` and `docker-compose` file have been included for convenience, however this may not be the best local development setup for this project. For more information on how to use Docker with this project, please see the [docker section](#docker).

## Node and Express setup
This application is designed to work as an API driven by Express. To setup your environment first you must install all required dependencies by running the following command from the root of your project directory:
```
npm install
```
Once all dependencies are installed you will need to setup some environment variables to interact with your database and application. 

## Environment variables
You will need to set some local environment variables to run this application. This is true even if you're using Docker.
```
touch .env
echo 'NODE_ENV=local
PORT=<your port>
DATABASE_SCHEMA=<your database schema>
JWT_KEY=<your secret JWT seed phrase or key>
DATABASE_URL=<your db connection string>
' >> ./.env
```
The `DATABASE_URL` is not a very clear var name, and the string is broken down as `postgres://username:password@host:port/database_name`

An example of the `DATABASE_URL` would be `DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres`

The various variables are defined as follows:
- `NODE_ENV` = The label for your environment. 
- `PORT` = The local port you wish to run on. Defaults to `3000`.
- `DATABASE_URL` = The URL string for your db connection. For example: `postgres://user:pass@example.com:5432/dbname`
- `DATABASE_SCHEMA` = Your local database schema. Postgres default is `public`.
- `JWT_KEY` = A secret value to generate JWT's locally. 
- `SMTP_HOST` = _optional_ hostname for the SMTP server used to send notification emails
- `SMTP_PORT` = _optional_ port number for the SMTP server used to send notification emails
- `SMTP_USER` = _optional_ username for the SMTP server used to send notification emails
- `SMTP_PASSWORD` = _optional_ password for the SMTP server used to send notification emails
- `URL` = _optional_ the URL for your front-end application
- `TEST_EMAIL` = _optional_ the email you wish to send tests to
- `BYPASS_LOGIN` = _optional_  Allows you to hit the endpoints locally without having to login. If you wish to bypass the login process during local dev, set this to `true`.

_We do not recommend using the default options for PostgreSQL. The above values are provided as examples. It is more secure to create your own credentials._

**Warning**: If you are running Docker Toolbox instead of Docker Desktop (likely meaning you are running Windows 10 Home, not Professional) you will need to change your `.env` to reflect Docker running on a VM: 
- `DATABASE_HOST`: The IP address Docker is running on. You can find this by running `docker-machine ip` but it's usually `192.168.99.100` instead of `localhost`
- `DATABASE_URL`: This will need to be adjusted as well, for example `DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres` would become `DATABASE_URL=postgres://postgres:postgres@192.168.99.100:5432/postgres`

### Example .env
To make this easier included below is an example `.env` file using all default values. ***We highly recommend*** you use custom values, but this should clarify what is needed for this to run.

```
NODE_ENV=development
PORT=3000
JWT_KEY=test123
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
DATABASE_SCHEMA=public
BYPASS_LOGIN=true
URL=http://localhost:8080
TEST_EMAIL=jason@codeforbaltimore.org
```

## PostgreSQL
***You will need a PostgreSQL database running locally to run this application locally.*** You may setup PostgreSQL however you wish, however we recommend using Docker using the instructions found here: https://hub.docker.com/_/postgres

If you are using Docker you may spin up your database layer by running this command:
```
docker run -d -e POSTGRES_PASSWORD=<your chosen password> -p 5432:5432 postgres
```

If you're running a database in another way then we trust you can sort it out on your own because you're awesome :sunglasses:

### Sequelize
To properly start the application the database needs to be built by Sequlize ahead of time. To do that run the following commands
1. You must create your database tables without running the application by running `npm run db-create` first.
2. _optional_ You can now seed your database if you wish by running `npm run db-seed`. 

Example `/migrations` and `/seeders` scripts have been supplied. You can rollback your all seeded data at any time by running `npm run db-unseed` and delete all created tables with `npm run db-delete`.

## Docker
You can build and run the application in Docker locally by running the following commands:
```
docker build -t bmoreres .
docker run -d -p 3000:3000 --env-file=.env bmoreres
```
Note that `DATABASE_URL` host location will be different depending on what OS you're using. On Mac it is `docker.for.mac.host.internal` and on Windows it is `docker.for.win.host.internal` if using `docker-compose` it will be `db`. Please see [Example .env](#example-env) for more information.

Alternatively you can manually set the environment variables and not use a `.env` file by setting the following vars:
```
-e NODE_ENV=development
-e PORT=3000 
-e JWT_KEY=<your JWT phrase>
-e DATABASE_URL=<your connection string>
-e DATABASE_DATABASE_SCHEMA=<your database schema>
```

### docker-compose
To use the `docker-compose.yml` file included you will first need to set [environment variables](#environment-variables). You **MUST** set your `DATABASE_HOST` to `db` to use the `docker-compose` solution. It is not recommended to use `docker-compose` for any reason other than to test a solution for a separate front-end component. 

# Using this product
You may use this product to create and manage users for your front-end. 

To run the application--after the above steps are completed--run `npm start`.

## Testing
To test your code you may write test cases to `./index.spec.js` and then run the tests with `npm test`.

To check your linting you may run `npm run lint` and to format and automatically fix your formatting run `npm run format`.

# Sources and Links
We are also building a front-end application called [Healthcare Rollcall](https://github.com/CodeForBaltimore/Healthcare-Rollcall) to interact with this backend API. To view that project, or to contribute to it, please visit the repo here: https://github.com/CodeForBaltimore/Healthcare-Rollcall

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.jasonanton.com"><img src="https://avatars0.githubusercontent.com/u/6391564?v=4" width="100px;" alt=""/><br /><sub><b>Jason Anton</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=revjtanton" title="Code">💻</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=revjtanton" title="Documentation">📖</a> <a href="#infra-revjtanton" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://jasonbixon.netlify.com"><img src="https://avatars3.githubusercontent.com/u/32110237?v=4" width="100px;" alt=""/><br /><sub><b>Jason Bixon</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=jbixon13" title="Code">💻</a> <a href="#infra-jbixon13" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/pulls?q=is%3Apr+reviewed-by%3Ajbixon13" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/cshamrick"><img src="https://avatars0.githubusercontent.com/u/2623452?v=4" width="100px;" alt=""/><br /><sub><b>cshamrick</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=cshamrick" title="Code">💻</a> <a href="#infra-cshamrick" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#security-cshamrick" title="Security">🛡️</a></td>
    <td align="center"><a href="https://ao10.github.io"><img src="https://avatars3.githubusercontent.com/u/14120224?v=4" width="100px;" alt=""/><br /><sub><b>Ati Ok</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=ao10" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/joffutt4"><img src="https://avatars0.githubusercontent.com/u/10181869?v=4" width="100px;" alt=""/><br /><sub><b>joffutt4</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=joffutt4" title="Code">💻</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=joffutt4" title="Documentation">📖</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/pulls?q=is%3Apr+reviewed-by%3Ajoffutt4" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/joffutt-bellese"><img src="https://avatars2.githubusercontent.com/u/61434152?v=4" width="100px;" alt=""/><br /><sub><b>joffutt-bellese</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=joffutt-bellese" title="Code">💻</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=joffutt-bellese" title="Documentation">📖</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/pulls?q=is%3Apr+reviewed-by%3Ajoffutt-bellese" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://snyk.io"><img src="https://avatars2.githubusercontent.com/u/19733683?v=4" width="100px;" alt=""/><br /><sub><b>Snyk bot</b></sub></a><br /><a href="#security-snyk-bot" title="Security">🛡️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://dependabot.com"><img src="https://avatars1.githubusercontent.com/u/27347476?v=4" width="100px;" alt=""/><br /><sub><b>Dependabot</b></sub></a><br /><a href="#security-dependabot[bot]" title="Security">🛡️</a></td>
    <td align="center"><a href="https://gnboor.se"><img src="https://avatars0.githubusercontent.com/u/2052524?v=4" width="100px;" alt=""/><br /><sub><b>Gabriel Boorse</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=gnboorse" title="Code">💻</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/pulls?q=is%3Apr+reviewed-by%3Agnboorse" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/bani-bellese"><img src="https://avatars0.githubusercontent.com/u/62711535?v=4" width="100px;" alt=""/><br /><sub><b>bani-bellese</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=bani-bellese" title="Code">💻</a> <a href="#infra-bani-bellese" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#security-bani-bellese" title="Security">🛡️</a></td>
    <td align="center"><a href="https://github.com/seancrim23"><img src="https://avatars1.githubusercontent.com/u/48462417?v=4" width="100px;" alt=""/><br /><sub><b>Sean Crim</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=seancrim23" title="Code">💻</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/pulls?q=is%3Apr+reviewed-by%3Aseancrim23" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/carorm"><img src="https://avatars2.githubusercontent.com/u/8696896?v=4" width="100px;" alt=""/><br /><sub><b>carorm</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=carorm" title="Tests">⚠️</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/pulls?q=is%3Apr+reviewed-by%3Acarorm" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/blakenan-bellese"><img src="https://avatars1.githubusercontent.com/u/61432973?v=4" width="100px;" alt=""/><br /><sub><b>blakenan-bellese</b></sub></a><br /><a href="#ideas-blakenan-bellese" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=blakenan-bellese" title="Tests">⚠️</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=blakenan-bellese" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/c-w-allen"><img src="https://avatars0.githubusercontent.com/u/64177457?v=4" width="100px;" alt=""/><br /><sub><b>c-w-allen</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=c-w-allen" title="Code">💻</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/pulls?q=is%3Apr+reviewed-by%3Ac-w-allen" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/msmith125"><img src="https://avatars2.githubusercontent.com/u/58228205?v=4" width="100px;" alt=""/><br /><sub><b>msmith125</b></sub></a><br /><a href="https://github.com/CodeForBaltimore/Bmore-Responsive/commits?author=msmith125" title="Tests">⚠️</a> <a href="https://github.com/CodeForBaltimore/Bmore-Responsive/pulls?q=is%3Apr+reviewed-by%3Amsmith125" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<p align="center">
    <img src="docs/img/CfB.png" width="400">
</p>
