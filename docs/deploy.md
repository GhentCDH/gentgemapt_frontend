# Deploy

## Deploy dist folder to github gh-pages

- https://gist.github.com/cobyism/4730490

```
npm run-script build
./node_modules/gh-pages/bin/gh-pages.js --dist 'dist' --branch 'release'
```

