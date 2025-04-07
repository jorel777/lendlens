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

# force clean and initialize git
rm -rf .git
git init
git checkout -b master

# add all files
git add -f .
git commit -m 'deploy'

# deploy to GitHub Pages
git push -f https://github.com/jorel777/lendlens.git master:gh-pages

cd - 