#############
### build ###
#############
FROM node:12.2.0 as build

WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH

COPY ./package.json /frontend/package.json
COPY ./angular.json /frontend
COPY ./tsconfig.json /frontend
COPY ./tsconfig.app.json /frontend
COPY ./src /frontend/src

RUN npm install -g @angular/cli
RUN npm install

RUN ng build --prod --output-path=dist

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine

RUN apt-get update && apt-get install -y wget
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz
CMD dockerize -wait http://yoga-server:4000

# copy artifact build from the 'build environment'
COPY --from=build /frontend/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
