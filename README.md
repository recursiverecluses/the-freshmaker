# the-freshmaker
Auto-reload for express.

### Install module

    npm install the-freshmaker

### Configure Express
Add the following to your express app.
```javascript
const express = require("express")
const app = express()
// Require the-freshmaker and pass in the variable for your express app.
require('the-freshmaker')(app)
```
### HTML setup
Add the following to webpages you want to restart when there is a change on the server.
```html
<script src="/the-freshmaker-client.js" type="text/javascript"></script>
```
    
### Use nodemon to restart node when files change.
    
    npm install -g nodemon
    
    nodemon --config nodemon.json app.js
    

#### nodemon.json

    {
        "watch": ["app.js", "public", "routes", "lib"],
        "ext": "js, css, html"
    }




