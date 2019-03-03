FROM node:latest

ADD . /usr/src/server

WORKDIR /usr/src/server

COPY package*.json ./
COPY . /usr/src/server


RUN npm install
#RUN npm install mongodb
#RUN npm install mongoose
RUN npm install -g nodemon
RUN npm install express

EXPOSE 8080
CMD [ "service", "mongod", "start" ]
CMD [ "nodemon" ]
