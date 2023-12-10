//さまざまなモジュールをインポート
const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use( "/assets", express.static( __dirname + "/assets"));
app.use( express.static( __dirname + "/public") );

// ルートディレクトリ
app.get( "/", (req, res) => {
    res.sendFile( __dirname + "/home.html" );
});

app.get( "/paneldestrike", (req, res) => {
    res.sendFile( __dirname + "/public/index.html" );
});

// io
io.on("connection", (socket) => {
    socket.emit("file name", fs.readdirSync( __dirname + "/assets/charactors" ), JSON.parse( fs.readFileSync( __dirname + "/assets/name.json" ) ) );
});

server.listen( PORT, () => { console.log(`PORT番号${PORT}で起動中・・・`); });