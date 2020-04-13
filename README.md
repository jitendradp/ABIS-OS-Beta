![Alt text](https://user-images.githubusercontent.com/19590434/79083022-bf040980-7d2b-11ea-90bf-06e7ca2b1801.png "Map and Chat View")
# Quickstart (run pre-build docker images)
**Prerequisites**
You will need at least version 19.03 of Docker Desktop installed

**Steps**

            docker-compose -f docker-compose-hub.yml up

# Development setup (build local docker images and run + Angular setup)
For a good developing experience across all platforms, it is advisable to use docker-compose for developing all services EXCEPT for frontend.
and setup the Angular development server separately
**Prerequisites**
1. Docker Desktop at least version 19.03 from https://docs.docker.com/install/linux/docker-ce/ubuntu/ OR https://www.docker.com/products/docker-desktop
2. Node v12.13.0 (LTS) from https://nodejs.org/en/download/   (at least nodejs version 10 and npm version 6.x)
3. Angular CLI install by using the command:
        
        npm install -g @angular/cli

**Steps**

        docker-compose -f up
        
        cd frontend
        npm install
        ng serve        OR          npm run start

# Architecture
##frontend --> yoga --> prisma --> db

* The development begins with the file /prisma/prisma.yml where the data model of the whole application is defined.
* yoga-server requires prisma-client to call prisma service. According to our operating system, execute one of the following scripts:

For LINUX:

        ./prisma/generate.sh

For WINDOWS:

        .\prisma\generate.bat

This script generates the prisma-client and copies it to ./yoga-server/src/generated/prisma-client

Check for an overview: https://www.prisma.io/docs/understand-prisma/prisma-basics-datamodel-client-and-server-fgz4/

and https://www.prisma.io/docs/1.34/prisma-client/setup/generating-the-client-TYPESCRIPT-r3c2/


# Hostnames and Ports
Used names for the services are also their hostnames

**Ports:**
* frontend (available at port 4200 for development and port 80 for deployment)
* yoga (available at port 4000)
* prisma (available at port 4466)
* db (available at port 5432)






# Overview
The repository is divided in the following subdirectories (in alphabetical order):
* /db
* /frontend
* /kubernetes
* /matrix
* /pgadmin
* /prisma
* /yoga-server

## db
db contains the Dockerfile to generate the docker image for the db container.

It also contains two SQL scripts to initialize the datebase with a schema and insert some data. These scripts are not necessary.

## frontend
The frontend is an angular-cli application that accesses the "yoga-server" via its graphql api. It uses the "graphql-codegen" utility together with the "typescript", "typescript-operations" and "typescript-apollo-angular" plugin to generate TypeScript types of the remote schema. To generate the client with ```npm run generate``` the "schema" value in the "codegen.yml" file must point to a running instance of "yoga-server".

**Important directories and files:**
* Angular app (/frontend/src/app)
* Query documents (/frontend/src/graphql/queries)
* Mutation documents (/frontend/src/graphql/mutations)
* graphql-codegen configuration (/frontend/src/codegen.yml)

## kubernetes
kubernetes contains all files, which are required to deploy the whole project to a kubernetes cluster.

## matrix
matrix contains ...

## pgadmin
pgadmin contains nothing. This could be used for sharing files with pgadmin container for debugging purpose.

## prisma
Prisma is used as the data layer of the application. It consists of a server and a command line utility. The cmd utility can be used to generate a database and access-code from a graphql-like schema definition. The backend database can either be postgresql, mysql or mongodb. Our docker-compose file uses postgresql.

You can run a local prisma server by using ```docker-compose up``` with the "docker-compose.yml" file in the root directory.
Changes to the schema (/prisma/datamodel.prisma) can be deployed to the running instance by using ```prisma deploy```.

**Important directories and files:**
* Schema file (/prisma/datamodel.prisma):
_All persisted types are listed here._
* Prisma cmd utility configuration (/prisma/prisma.yml)
* Docker compose file (/prisma/docker-compose.yml)

## yoga-server
This node application provides the main api endpoint. It interfaces with the prisma server via the generated code from the "/prisma/generated" directory. It itself provides a GraphQL API via http to the frontend. The types of the api-schema are mostly similar to the ones of the persistence layer. 

To run the server, compile the code with ``tsc `` and run the result on the command line using: ```node dist/index.js```.

# WHY IS schema.graphql NOT IN REPOSITORY ????
**Important directories and files:**
* Api schema definition (/yoga-server/schema.graphql)


# Building from scratch
**Prerequisites**
You will need at least version 10 of nodejs as well as npm 6.x installed before you can proceed.

**Steps**
1. Clone the repository to a directory on your disk and "cd" into it 
_watch out: these instructions might not be working for some branches_
2. cd to "/prisma" and run "npm install"
3. cd to "/yoga-server" and run "npm install"
4. cd to "/frontend" and run "npm install"
5. Get the prisma server up and running by using the docker-compose.yml or by any other means (The config of prisma is in the docker-compose.yml in root directory AbisStarterkit)
_run "cd /prisma", then "docker-compose up"._
6. Deploy the prisma data model:
_run "cd /prisma", then "prisma deploy"_
7. Generate the prisma client code:
_run "generate.sh" - this will generate the client code and also move it to the "/yoga-server/src/generated/ directory_
8. Run the yoga-server:
_cd to "/yoga-server" then run "tsc" and then "node dist/index.js"_
9. Generate the frontend client code:
_cd to "/frontend" then run "npm run generate"_
10. Start the frontend:
_run "ng serve --host local.abis-cloud.com" (be sure to include this hostname in your "/etc/hosts")_

If you're on Windows, all the steps above should apply except that you cannot execute the *.sh script to generate and move the prisma client code to the yoga server. In this case you have to perform the windows equivalents of the commands in that shell script manually or write a *.bat file.

Docker for windows: https://docs.docker.com/toolbox/toolbox_install_windows/

Untested for now. Good luck!



