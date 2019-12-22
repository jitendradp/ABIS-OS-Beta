#############
### build ###
#############

# base image
FROM sandrokeil/typescript

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json

RUN npm install

# add app
COPY ./src /app

# generate build
RUN node
