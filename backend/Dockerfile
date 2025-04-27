FROM node:20-alpine

#working directory
WORKDIR /usr/src/app

#copying the backend package.json
COPY package*.json ./

#installing production dependencies
RUN npm install

#copying entire backend folder
COPY . .

#exposing port 4000 to communicate with
EXPOSE 4000

#execute command finally
CMD ["npm", "start"]