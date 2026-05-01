#!/bin/sh
# Railway sets PORT dynamically — inject it into nginx config
PORT=${PORT:-8080}

cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen ${PORT};
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/html text/css application/javascript application/json;
    gzip_min_length 256;

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
}
EOF

echo "Starting nginx on port ${PORT}..."
nginx -g "daemon off;"
