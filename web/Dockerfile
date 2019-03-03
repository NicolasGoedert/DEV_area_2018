FROM node

ADD . /usr/src/web
    
WORKDIR /usr/src/web

COPY . /usr/src/web

RUN npm install
RUN npm install -g nodemon
RUN npm install express

EXPOSE 8081

CMD ["node", "web.js"]