var app = require ('express')(),
    parser = require ('body-parser'),
    morgan = require ('morgan'),
    expressSession = require ('express-session'),
    cookieParser = require ('cookie-parser');

var UserRouter = require ('./routes/user-routes');
var ChatRouter = require ('./routes/chat-routes');

app.use (parser.json());
app.use (cookieParser());
app.use (expressSession ({secret: 'winteriscoming', resave: false, saveUninitialized: true, cookie: {maxAge: 60000}}));

// routers config
app.use ('/user', UserRouter);
app.use ('/chat', ChatRouter);

app.listen (3000, () => console.log ('server running on localhost:3000'));