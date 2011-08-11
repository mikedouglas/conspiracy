var connect = require('connect');
var server = connect.createServer();

server.use(connect.static(__dirname));
server.use('/lib', connect.static(__dirname + '/../lib'));
server.use('/examples', connect.static(__dirname + '/../examples'));
server.use('/static', connect.static(__dirname + '/static'));
server.use(require('browserify')({
  require: [__dirname + '/../lib/eval.js',
            __dirname + '/../lib/lambda.js',
            __dirname + '/../lib/macro.js',
            __dirname + '/../lib/primitives.js',
            __dirname + '/../lib/print.js',
            'util',
            'underscore',
            'pegjs'],
  //filter: require('uglify-js')
}));

server.listen(9797, '127.0.0.1');
console.log('Listening on 127.0.0.1:9797...');
