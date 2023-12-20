FROM oraclelinux:7-slim

RUN yum -y install vim nodejs 

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start-dev"]