/////////////////////////// modules ///////////////////////////////
var express             = require('express'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    port                = process.env.PORT || 8000,
    environment         = process.env.NODE_ENV,
    path                = 'path';

//////////////////////// configuration ///////////////////////////////

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json()); // parse as json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

app.use(express.static('./src/client/'));
app.use(express.static('./'));

//////////////////////// start app ///////////////////////////////
app.listen(port, function() {
    console.log('listening on port ' + port + '...');
    console.log('__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});
