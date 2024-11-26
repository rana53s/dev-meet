# From Node20 Base Image
FROM node:20.17.0-alpine3.20

WORKDIR /home/app/

RUN apk add --no-cache curl

# Copying source code to the docker image
COPY package.json .

RUN npm install

COPY src/ ./src/

COPY Dockerfile Dockerfile

ENV PORT=3005

EXPOSE 3005

HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost:${PORT}/health || exit 1

CMD [ "npm", "start" ]