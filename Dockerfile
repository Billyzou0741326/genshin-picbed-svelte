FROM node:14-alpine3.14 AS dev_dep
COPY ./package.json /root/app/
WORKDIR /root/app/
RUN npm install


FROM node:14-alpine3.14 AS prod_dep
COPY ./package.json /root/app/
WORKDIR /root/app/
RUN npm install --production


FROM node:14-alpine3.14 AS source
WORKDIR /root/app/
COPY . /root/app/
COPY --from=dev_dep /root/app/package-lock.json /root/app/
COPY --from=dev_dep /root/app/node_modules/ /root/app/node_modules/
RUN npx svelte-kit build


FROM node:14-alpine3.14 AS runtime
ENV APP_PORT=3000
EXPOSE $APP_PORT
WORKDIR /root/app/
COPY --from=prod_dep /root/app/node_modules/ /root/app/node_modules/
COPY --from=source /root/app/.env.example /root/app/.env
COPY --from=source /root/app/build/ /root/app/build/
COPY --from=source /root/app/package*.json /root/app/
ENTRYPOINT PORT=$APP_PORT                     \
           MYSQL_PORT=${MSYQL_PORT:-3306}     \
           node -r dotenv/config ./build/index.js
