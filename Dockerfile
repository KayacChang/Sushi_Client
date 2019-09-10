FROM nginx
MAINTAINER scott.chen@sixonetech.com
RUN mkdir -p /usr/share/game/sushi
RUN mkdir -p /etc/nginx/ssl
COPY nginx.conf /etc/nginx/nginx.conf
COPY sushi-web.conf /etc/nginx/conf.d/default.conf
COPY weberverbygo_proxy.conf /etc/nginx/conf.d/weberverbygo_proxy.conf
COPY project /usr/share/game/sushi
COPY project/locales /usr/share/game/sushi/dist/locales
VOLUME ["/usr/share/game/sushi/dist"]
VOLUME ["/etc/nginx/conf.d"]
VOLUME ["/etc/nginx/ssl"]
EXPOSE 80
EXPOSE 443
EXPOSE 8001
