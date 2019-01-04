var cors = require('cors');


var app=require('express')();
app.use(cors());
app.all('/*', function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
          res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
          next();
        });
var mongoose=require('mongoose');
var swig=require('swig');
//app.set('views',path.join(__dirname,'views'));
app.engine('html',swig.renderFile);
app.set('view engine','html');
var parser=require('body-parser');
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json())
mongoose.connect("mongodb://localhost:27017/location")
var db=mongoose.connection
var nameSchema = new mongoose.Schema({
 cont: String,
 input: String
 
});

var loc=mongoose.model('Loct',nameSchema);

app.post('/save',(req,res) =>{
	console.log(req.body);
	//var userData = new User(req.body);
	var loca=new loc(req.body);
	loca.save((err,tos)=>{
		if(err)
			res.send(err);
		//res.json(tos);	
	});
	//res.json(req.body.todo);
	res.redirect("http://localhost:3000/geo");
	//res.end();
});
app.get('/find',(req,res) =>{
	loc.find({},(err,data)=>{
		res.json(data);
})
})
app.listen(5000);



