#!/bin/sh

# Generate `config.json` file based on environment variables
cat <<EOF > /usr/share/nginx/html/config.json
{
    "URL_INFOSITE": "${URL_INFOSITE:-https://localhost/site}",
    "URL_MAP": "${URL_MAP:-http://localhost}",
    "URL_API": "${URL_API:-http://localhost/api}",
    "DEBUG": ${DEBUG:-false}
}
EOF
