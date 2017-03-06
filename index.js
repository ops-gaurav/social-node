var express = require ('express'),
    app = express(),
    parser = require ('body-parser'),
    expressSession = require ('express-session'),
    cookieParser = require ('cookie-parser');

var server = require ('http').createServer (app);
var io = require ('socket.io')(server);

 app.use (express.static (__dirname+ '/views'));
    app.use (parser.json());
    app.use (cookieParser());
    app.use (expressSession ({secret: 'winteriscoming', resave: false, saveUninitialized: true, cookie: {maxAge: 60000}}));


app.get ('/', (req, res) => {
    res.sendFile ('index.html');
});

io.on ('connection', (socket) => {
    socket.emit ('server-connected', {connected: true});
    console.log ('connected');

    var UserRouter = require ('./routes/user-routes');
    var ChatRouter = require ('./routes/chat-routes')(socket);

    // routers config
    app.use ('/user', UserRouter);
    app.use ('/chat', ChatRouter);
});

server.listen (3000, () => console.log ('server running on localhost:3000'));