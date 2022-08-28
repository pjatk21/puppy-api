FROM node:18 AS builder

WORKDIR /app/puppy-api

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn prisma generate

RUN yarn build

RUN yarn install --production

FROM node:18 AS frontend

ARG VITE_GOOGLE_CLIENTID

WORKDIR /app/puppy-spa

COPY ./spa/package.json ./spa/yarn.lock ./

RUN yarn install

COPY ./spa .

RUN yarn build

FROM node:18-slim AS runner

ENV NODE_ENV=production

COPY --from=frontend /app/puppy-spa/dist /app/puppy-spa/dist

WORKDIR /app/puppy-api

COPY package.json yarn.lock ./
COPY --from=builder /app/puppy-api/node_modules ./node_modules
COPY --from=builder /app/puppy-api/dist ./dist
COPY --from=builder /app/puppy-api/prisma ./prisma
COPY --from=builder /app/puppy-api/src/**/*.graphql ./src/
COPY --from=builder /app/puppy-api/src/**/*.gql ./src/

EXPOSE 3000

CMD ["yarn", "start.prod"]
