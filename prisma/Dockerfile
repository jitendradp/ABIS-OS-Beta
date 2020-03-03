FROM gdhami/prisma-1.34-cli
#FROM prismagraphql/prisma:1.34
WORKDIR /usr/prisma/
COPY . .
RUN ["prisma", "generate"]
CMD ["prisma", "deploy"]
