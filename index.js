const port = process.env.PORT || 3000

var express = require("express"),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    config = require('./config/config'),
    app = express(),
    middleware = require('./server/middleware');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get("/version", middleware,(req, res, next) => {
    res.json({
        "version": process.env.VERSION
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/home.html');
});

app.post('/post', function (request, response) {
    response.send(request.body);
});

app.post('/login', (req, res) => {
    console.log(req.body);
    if (req.body.user === "admin" && req.body.pass === "admin") {
        const payload = {
            check: true
        };
        
        const token = jwt.sign(payload, config.key, {
            expiresIn: 1440
        });
        res.json({
            mensaje: 'Autenticación correcta',
            token: token
        });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrectos" })
    }
});

app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready On Server http://localhost:${port}`)
});
