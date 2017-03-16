var express = require ('express'),
    app = express(),
    parser = require ('body-parser'),
    expressSession = require ('express-session'),
    cookieParser = require ('cookie-parser');

var server = require ('http').createServer (app);
var io = require ('socket.io')(server);

app.use (express.static (__dirname+ '/artifacts'));
app.use (parser.json());
app.use (cookieParser());
app.use (expressSession ({secret: 'winteriscoming', resave: false, saveUninitialized: true, cookie: {maxAge: 60000}}));

app.get ('/', (req, res) => res.redirect ('/login'));
app.get ('/login', (req, res) => res.sendFile (__dirname + '/views/login.html'))

app.get ('/chat', (req, res) => {
    if (req.session.user)
        res.sendFile (__dirname+ '/views/chat.html');
    else
        res.redirect ('/login');
});

app.get ('/signup', (req, res) => res.sendFile (__dirname +'/views/signup.html'));

io.on ('connection', (socket) => {
    socket.emit ('server-connected', {connected: true});
    console.log ('connected');

    var users = [];

    socket.on ('user-joined', (data) => {
        console.log ('user '+ data.username +' joined the chat room');
        users.push (data.username);

        socket.emit ('new-user', {user: data.username, total: users.length});
    });
    var UserRouter = require ('./routes/user-routes');
    var ChatRouter = require ('./routes/chat-routes')(socket);

    // routers config
    app.use ('/user', UserRouter);
    app.use ('/chat', ChatRouter);
});

server.listen (3000);
