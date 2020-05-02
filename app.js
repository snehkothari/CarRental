const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')



const carRoutes = require('./api/routes/cars');
const bookRoutes = require('./api/routes/books');


mongoose.connect('mongodb+srv://sneh:snehkothari@carrental-ylinl.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser:true,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res ,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','*');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,GET,DELETE');
		return res.status(200).json({});
	}
	next();
});


app.use('/cars', carRoutes);
app.use('/books',bookRoutes);

app.use((req,res,next)=>{
	const error = new Error('Not found');
	error.status = 404;
	next(error);

})

app.use((error, req, res, next)=>{
	res.status(error.status || 500);
	res.json({
		error:{
			message: error.message
		}
	});
});

module.exports = app;