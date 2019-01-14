var cors = require('cors');

var express = require('express');
var socket = require('socket.io');
var mongoose=require("mongoose");
var parser=require('body-parser');
var app = express();
app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
mongoose.connect("mongodb://localhost:27017/disaster")
var db=mongoose.connection
var nameSchema =  new mongoose.Schema(
  {
    author: String,
    message: String
  },
  { timestamps: true }
);
app.use(cors());
app.all('/*', function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
          res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
          next();
        });
var chatroom=mongoose.model('chatroom',nameSchema);

app.get("/show",(req,res) =>{
	chatroom.find({},(err,data)=>{
		res.json(data);
})
});

server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data){
	console.log(data.author,data.message);
	var chat=new chatroom(data);
	chat.save((err,tos)=>{
		if(err)
			console.log(err);
		console.log(tos);	
	});
        io.emit('RECEIVE_MESSAGE', data);
    })
});


