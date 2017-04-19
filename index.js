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
app.use (expressSession ({secret: 'winteriscoming', resave: false, saveUninitialized: true, cookie: {maxAge: 10000000000000}}));

app.get ('/', (req, res) => res.redirect ('/login'));
app.get ('/login', (req, res) => res.sendFile (__dirname + '/views/login.html'))

app.get ('/chat', (req, res) => {
    if (req.session.user)
        res.sendFile (__dirname+ '/views/chat.html');
    else
        res.redirect ('/login');
});

app.get ('/signup', (req, res) => res.sendFile (__dirname +'/views/signup.html'));

var users = [];
var connected = [];

io.on ('connection', (socket) => {
    socket.emit ('server-connected', {connected: true});
    console.log ('connected');

    socket.on ('user-joined', (data) => {

        console.log (socket.id + ' for '+ data.username);
        console.log ('user '+ data.username +' joined the chat room');
        
        users.push (data.username);

        var contains = false;
        for (var i=0; i<connected.length;i++)
            if (connected[i].username == data.username) {
                connected[i].sid = socket.id;
                contains = true;
                break;
            }

        if (!contains) 
            connected.push ({username: data.username, sid: socket.id});

        console.log (connected);

        connected.forEach ((id) => {
            io.to (id.sid).emit ('new-user', {user: id.username});
        });
    });

    socket.on ('new-chat', (data) => {
        console.log (data+ ' at index');
        connected.forEach ((id) => {
            io.to (id.sid).emit ('new-message', data);
        });
    });

    var UserRouter = require ('./routes/user-routes');
    var ChatRouter = require ('./routes/chat-routes')(socket);

    // routers config
    app.use ('/user', UserRouter);
    app.use ('/chat', ChatRouter);
});

server.listen (3000);
