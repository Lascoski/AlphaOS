FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY alphaos-backend/package*.json ./alphaos-backend/
RUN npm --prefix alphaos-backend ci --omit=dev

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "alphaos-backend/server.js"]
