FROM gdhami/prisma-1.34-cli
#FROM prismagraphql/prisma:1.34
WORKDIR /usr/prisma/
COPY . .
#RUN ["prisma", "generate"]
#CMD ["prisma", "deploy"]

# Add wait-for-it
COPY wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

#ENTRYPOINT [ "/bin/sh", "-c" ]
CMD ["sh", "-c", "./wait-for-it.sh" , "db:5432" , "--strict" , "--timeout=300" , "--" , "prisma", "deploy"]
