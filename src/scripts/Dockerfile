FROM node:18-alpine as build
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN npm install --only=production
CMD ["npm", "start"]