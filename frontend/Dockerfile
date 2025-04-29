# Frontend Dockerfile
FROM node:20

WORKDIR /app

COPY ./frontend/package*.json ./

RUN rm -rf node_modules package-lock.json


RUN npm install

RUN npm install nuxt

COPY ./frontend /app/

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

