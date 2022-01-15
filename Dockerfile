FROM node:16-alpine3.15 AS dev_dep
COPY ./package*.json /root/app/
WORKDIR /root/app/
RUN npm install


FROM node:16-alpine3.15 AS prod_dep
COPY ./package*.json /root/app/
WORKDIR /root/app/
RUN npm install --production && npm cache clean --force


FROM node:16-alpine3.15 AS source
WORKDIR /root/app/
COPY . /root/app/
COPY --from=dev_dep /root/app/package-lock.json /root/app/
COPY --from=dev_dep /root/app/node_modules/ /root/app/node_modules/
RUN npx svelte-kit build


FROM node:16-alpine3.15 AS runtime
ENV PORT=3000
EXPOSE $PORT
WORKDIR /root/app/
COPY --from=prod_dep /root/app/node_modules/ /root/app/node_modules/
COPY --from=source /root/app/build/ /root/app/build/
COPY --from=source /root/app/package*.json /root/app/
ENTRYPOINT [ "node", "./build/index.js" ]
