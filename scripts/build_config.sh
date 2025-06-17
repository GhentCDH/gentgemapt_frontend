#!/bin/sh

# Generate `config.json` file based on environment variables
cat <<EOF > /usr/share/nginx/html/config.json
{
    "URL_INFOSITE": "${URL_INFOSITE:-/site}",
    "URL_MAP": "${URL_MAP:-/}",
    "URL_API": "${URL_API:-/data}",
    "DEBUG": ${DEBUG:-false}
}
EOF
