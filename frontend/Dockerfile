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

# copy artifact build from the 'build environment'
COPY --from=build /frontend/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
