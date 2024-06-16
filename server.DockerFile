# Use node 14.17.1 LTS
FROM node:14.17.1
ENV LAST_UPDATED 20210617T132300

#Copy Source Code
COPY . /bba-server

#Change Working Directory
WORKDIR /bba-server

#Install Dependencies
RUN npm install pm2 -g
RUN npm install

#EXPOSE API Port to the Outside
EXPOSE 80

#LAUCNH APPLICATION
CMD ["pm2-runtime", "ecosystem.config.js"]