FROM node:latest
WORKDIR "/app"
COPY package.json ./
# átmásolom a package.json-t a gyökérbe
RUN npm install
COPY . .
# átmásolok mindent mindenhova
CMD [ "npm", "run", "start" ]