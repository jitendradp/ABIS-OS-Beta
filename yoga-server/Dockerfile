#############
### build ###
#############

# base image
FROM node:latest

RUN apt-get update && apt-get install -y wget
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz
CMD dockerize -wait http://prisma:4466

WORKDIR /usr/yoga/
COPY ./src  src
COPY ./package-lock.json package-lock.json
COPY ./package.json package.json
COPY ./tsconfig.json tsconfig.json
RUN npm install
RUN npm install typescript -g
RUN tsc
EXPOSE 4000
CMD ["node", "dist/index.js"]
