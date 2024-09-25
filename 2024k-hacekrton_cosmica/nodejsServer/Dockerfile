FROM node
COPY package.json ./package.json
COPY ./ /app
WORKDIR /app
RUN npm install
EXPOSE 5000
ENTRYPOINT ["node", "App.js"]
