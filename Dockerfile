FROM node:18-alpine as build
WORKDIR /usr/src/app
COPY package.json tsconfig.json .
RUN npm install
COPY src ./src
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY package.json .
RUN npm install --only=production
CMD ["npm", "start"]