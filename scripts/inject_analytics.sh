#!/bin/sh

# Path to the index.html file
INDEX_FILE="/usr/share/nginx/html/index.html"

# Check if GOOGLE_ANALYTICS_ID is set
if [ -z "$GOOGLE_ANALYTICS_ID" ]; then
  echo "GOOGLE_ANALYTICS_ID is not set. Skipping analytics injection."
  exit 0
fi

# Google Analytics script
ANALYTICS_SCRIPT=$(cat <<EOF
<script async src="https://www.googletagmanager.com/gtag/js?id=$GOOGLE_ANALYTICS_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '$GOOGLE_ANALYTICS_ID');
</script>
EOF
)
ANALYTICS_SCRIPT=$(echo "$ANALYTICS_SCRIPT" | tr -d '\n')

## Inject the script into index.html
if [ -f "$INDEX_FILE" ]; then
  sed -i "s#</head>#$ANALYTICS_SCRIPT</head>#" "$INDEX_FILE"
  echo "Google Analytics script injected successfully."
else
  echo "index.html file not found at $INDEX_FILE."
  exit 1
fi
