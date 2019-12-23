#############
### build ###
#############

# base image
FROM node:latest

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
