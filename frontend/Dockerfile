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
RUN apk update && apk upgrade && apk add bash

# copy artifact build from the 'build environment'
COPY --from=build /frontend/dist /usr/share/nginx/html

# Add wait-for-it
COPY ./wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

# expose port 80
EXPOSE 80

# run nginx
#CMD ["nginx", "-g", "daemon off;"]

#ENTRYPOINT [ "/bin/sh", "-c" ]
CMD ["sh", "-c", "./wait-for-it.sh yoga:4000 -s -t 30 -- nginx -g", "daemon off;"]
