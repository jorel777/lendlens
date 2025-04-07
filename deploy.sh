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

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:jorel777/lendlens.git main:gh-pages
# git push -f https://github.com/jorel777/lendlens.git main:gh-pages 