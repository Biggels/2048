steps to make animate-css-grid work, since it's a node package but this is front-end javascript running in the browser
1. npm init
2. npm install animate-css-grid
3. npm install browserify
4. npx browserify app.js > bundle.js
5. include `<script src="bundle.js"></script>` in the html
6. make sure you don't have `type="module"` in that script tag
7. can then use require syntax to load animate-css-grid (`const animateCSSGrid = require('animate-css-grid'); const wrapGrid = animateCSSGrid.wrapGrid;`)

can pass a config object as the second argument of wrapGrid(), lets you define the duration, timing function, etc.
https://github.com/aholachek/animate-css-grid?tab=readme-ov-file for reference

n2s: probably could have just included the cdn script and then not imported or required it, but just used it, and then bypassed the bundling. i thought i tried and failed with that approach, but i may have been trying to still import...worth trying again
