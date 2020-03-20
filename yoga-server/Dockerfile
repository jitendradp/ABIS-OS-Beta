#############
### build ###
#############

# base image
FROM node:latest
WORKDIR /usr/yoga/
COPY ./src  src
COPY ./package-lock.json package-lock.json
COPY ./package.json package.json
COPY ./tsconfig.json tsconfig.json
COPY ./wait-for-it.sh wait-for-it.sh
RUN npm install
RUN npm install typescript -g
RUN tsc
EXPOSE 4000

#CMD wait-for-it.sh prisma:2000
#CMD ["node", "dist/index.js"]


# Add wait-for-it
COPY wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

#ENTRYPOINT [ "/bin/sh", "-c" ]
CMD ["sh", "-c", "./wait-for-it.sh prisma:4466 -s -t 30 -- node dist/index.js"]