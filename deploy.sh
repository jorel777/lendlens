#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# copy index.html to 404.html for GitHub Pages SPA support
cp index.html 404.html

# create .nojekyll file to bypass GitHub Pages Jekyll processing
touch .nojekyll

cd -

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git add -f dist
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git subtree push --prefix dist origin gh-pages 