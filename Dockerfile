FROM nginx:alpine

# Copy static site
COPY site/ /usr/share/nginx/html/

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
