steps to make animate-css-grid work in live browser preview
1. npm init
2. npm install animate-css-grid
3. npm install browserify
4. npx browserify app.js > bundle.js
5. include `<script src="bundle.js"></script>` in the html
6. make sure you don't have `type="module"` in that script tag

can pass a config object as the second argument of wrapGrid(), lets you define the duration, timing function, etc.
https://github.com/aholachek/animate-css-grid?tab=readme-ov-file for reference
