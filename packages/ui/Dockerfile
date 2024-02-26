FROM  ghcr.io/gravity-ui/node-nginx:ubuntu20-nodejs18

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY deploy ./deploy
COPY deploy/nginx /etc/nginx
COPY deploy/supervisor /etc/supervisor

COPY . .

ARG UI_VERSION
ARG DEV

# build app
RUN npm ci -q --no-progress --include=dev --also=dev
RUN npm run build
RUN npm prune --production
RUN rm -rf assets src /tmp/* /root/.npm

EXPOSE 80

ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
