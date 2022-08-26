FROM node:18 AS builder

WORKDIR /app/puppy-api

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn prisma generate

RUN yarn build

RUN yarn install --production

FROM ghcr.io/pjatk21/puppy-spa:latest AS frontend

FROM node:18-slim AS runner

ENV NODE_ENV=production

COPY --from=frontend /app/puppy-spa /app/puppy-spa

WORKDIR /app/puppy-api

COPY package.json yarn.lock ./
COPY --from=builder /app/puppy-api/node_modules ./node_modules
COPY --from=builder /app/puppy-api/dist ./dist
COPY --from=builder /app/puppy-api/prisma ./prisma
COPY --from=builder /app/puppy-api/src/**/*.graphql ./src/
COPY --from=builder /app/puppy-api/src/**/*.gql ./src/

EXPOSE 3000

CMD ["yarn", "start.prod"]
