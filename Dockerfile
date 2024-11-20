# From Node20 Base Image
FROM node:20.17.0-alpine3.20

WORKDIR /home/app/

# Copying source code to the docker image
COPY package.json .

RUN npm install

COPY src/ ./src/

COPY Dockerfile Dockerfile

ENV PORT=3005

EXPOSE 3005

CMD [ "npm", "start" ]