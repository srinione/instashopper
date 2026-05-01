FROM nginx:alpine

# Install bash (more reliable than sh for scripts)
RUN apk add --no-cache bash

# Copy site files
COPY site/ /usr/share/nginx/html/

# Copy nginx template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# nginx:alpine with the templates folder automatically runs envsubst on startup
# No custom script needed — Railway's PORT is injected automatically

EXPOSE 8080
