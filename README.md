# Overview
The repository is divided in three folders:
* /prisma
* /yoga-server
* /frontend

## prisma
Prisma is used as the data layer of the application. It consists of a server and a command line utility. The cmd utility can be used to generate a database and access-code from a graphql-like schema definition. The backend database can either be postgresql, mysql or mongodb. Our docker-compose file uses postgresql.

You can run a local prisma server by using ```docker-compose up``` with the "/prisma/docker-compose.yml" file.
Changes to the schema (/prisma/datamodel.prisma) can be deployed to the running instance by using ```prisma deploy```.

**Important directories and files:**
* Schema file (/prisma/datamodel.prisma):
_All persisted types are listed here._
* Prisma cmd utility configuration (/prisma/prisma.yml)
* Docker compose file (/prisma/docker-compose.yml)

## yoga-server
This node application provides the main api endpoint. It interfaces with the prisma server via the generated code from the "/prisma/generated" folder. It itself provides a GraphQL API via http to the frontend. The types of the api-schema are mostly similar to the ones of the persistence layer. 

To run the server you will need to provide a configuration file (/yoga-serverr/src/config.ts) of the following form:
```
export const config = {
    env: {
        domain: "local.abis-cloud.com"      // For a smooth cookie handling in local dev scenarios you should create an entry like this that points to 127.0.0.1 in your "hosts" file.
    },
    auth: {
        sessionTimeout:1000 * 60 * 60 * 24, // one day session timeout
        tokenLength:64,                     // The length of the auth- and csrf-tokens in characters.
        bcryptRounds:15,                    // The bcrypt salt round count
        normalizedResponseTime:500          // Some methods like "signup" and "login" will delay their response to at least this configured time in ms.
    },
    mailer: {
        smtpSender: "your-email@address.net",
        smtpUser: "your-email@address.net",
        smtpPassword: "yourSmtpPasswordd",
        smtpServer: "your.smtp-server.net"
    }
};
``` 
then compile the code with ``tsc ``  run the result on the command line using: ```node dist/index.js```.

**Important directories and files:**
* Api schema definition (/yoga-server/schema.graphql)

## frontend
The frontend is an angular-cli application that accesses the "yoga-server" via its graphql api. It uses the "graphql-codegen" utility together with the "typescript", "typescript-operations" and "typescript-apollo-angular" plugin to generate TypeScript types of the remote schema. To generate the client with ```npm run generate``` the "schema" value in the "codegen.yml" file must point to a running instance of "yoga-server".

**Important directories and files:**
* Angular app (/frontend/src/app)
* Query documents (/frontend/src/graphql/queries)
* Mutation documents (/frontend/src/graphql/mutations)
* graphql-codegen configuration (/frontend/src/codegen.yml)


# Building from scratch
**Prerequisites**
You will need at least version 10 of nodejs as well as npm 6.x installed before you can proceed.

**Steps**
1. Clone the repository to a directory on your disk and "cd" into it 
_watch out: these instructions might not be working for some branches_
2. cd to "/prisma" and run "npm install"
3. cd to "/yoga-server" and run "npm install"
4. cd to "/frontend" and run "npm install"
5. Get the prisma server up and running by using the docker-compose.yml or by any other means
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



