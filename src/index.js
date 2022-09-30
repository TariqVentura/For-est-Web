const { json } = require('express');
const express = require('express');
const Layouts = require('express-ejs-layouts');
const path = require('path');
const crud = require('../controllers/crud');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('view engine', '.ejs');
app.set('port', process.env.PORT || 3001)

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
app.use(express(json));
app.use(Layouts);

require('./socket')(io);

app.use('/', require('./router'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('login', {alert: true, alertTitle: "Bienvenidx!", alertMessage: "Bienvenidx al Sistema For-est, ingresa tus credenciales para continuar", alertIcon: "info"})
});

app.get('/inicio', (req, res) => {
    res.render('index')
});

app.get('/resources', (req, res) => {
    res.render('resources')
});

app.get('/changepassword', (req, res) => {
    res.render('changepassword')
});

 app.get('/schedule', (req, res) => {
     res.render('schedule')
 });

app.get('/doc', (req, res) => {
    res.render('doc')
})

server.listen(app.get('port'), () => {
    console.log('El servidor se ha iniciado');
});