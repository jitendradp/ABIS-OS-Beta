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
CMD dockerize -template /etc/nginx/nginx.tmpl:/etc/nginx/nginx.conf -stdout /var/log/nginx/access.log -stderr /var/log/nginx/error.log -wait http://prisma:4466
# set working directory
WORKDIR /

EXPOSE 4000

# add app
COPY ./tsconfig.json /tsconfig.json
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json
COPY ./src /src

RUN npm install
RUN npm install typescript -g
RUN tsc

# generate build
CMD ["node", "dist/index.js"]
