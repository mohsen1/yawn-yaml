#!/bin/bash

# Store the original package.json in a temporary variable
packageJson=$(cat package.json)

# Remove main and module from package.json using Node.js
# we do this due to some limitations in Parcel in which it does not allow a package.json to have main and module entries
node -e "const fs = require('fs'); const packageJson = JSON.parse(fs.readFileSync('package.json')); delete packageJson.main; delete packageJson.module; fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));"

mkdir -p docs/demo
npx parcel build --no-cache --dist-dir=docs/demo demo/index.html

# Add .nojekyll for GitHub Pages
touch docs/.nojekyll

# Restore the original package.json
echo "$packageJson" > package.json
