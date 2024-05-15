FROM node:21 as base

RUN npm install -g pnpm

FROM base as dependencies

WORKDIR /usr/app/src

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

FROM base as build

WORKDIR /usr/app/src

COPY . .
COPY --from=dependencies /usr/app/src/node_modules ./node_modules

RUN pnpm prisma generate
RUN pnpm build
RUN pnpm prune --prod

FROM node:21.7.3-alpine as deploy

WORKDIR /usr/app/src

RUN npm i -g pnpm prisma

COPY --from=build /usr/app/src/dist ./dist
COPY --from=build /usr/app/src/node_modules ./node_modules
COPY --from=build /usr/app/src/package.json ./package.json
COPY --from=build /usr/app/src/prisma ./prisma

EXPOSE 3333

CMD ["pnpm", "run", "start:prod"]