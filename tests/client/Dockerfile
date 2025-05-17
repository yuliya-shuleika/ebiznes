FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/node_modules/.cache && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
