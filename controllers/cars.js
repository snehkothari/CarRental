const Book = require('../models/book');
const Car = require('../models/car');
const mongoose = require('mongoose');

let date_ob = new Date();
//current day
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
	let year = date_ob.getFullYear();

//Adding a new car to the database.
exports.add_car=(req, res, next)=>{
	const car = new Car({
		_id: new mongoose.Types.ObjectId(),
		vehicle_no: req.body.vehicle_no,
		rent: req.body.rent,
		model: req.body.model,
		seat_capacity: req.body.seat_capacity,
		bookings:Number(req.body.bookings)
	});
	car.save().then(result=> {
		console.log(result);
		res.status(201).json({
		message: 'Handling POST requests',
		AddedCar: car
	});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

//Getting all the cars present in the database
exports.get_all_cars = (req, res, next)=>{
	Car.find()
	.select('_id vehicle_no rent model seat_capacity bookings')
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			cars:docs.map(doc=>{
				return{
					vehicle_no: doc.vehicle_no,
					rent: doc.rent,
					model: doc.model,
					seat_capacity: doc.seat_capacity,
					_id: doc._id,
					bookings:doc.bookings
				}
			})
		};
		if(docs.length >= 0){
			res.status(200).json(response);			
		}
		else{
			res.status(404).json({
				message: 'No Cars present'
			});
		}
		})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error:err
		});
	});
}
//Updating car details if no bookings for the car exist now or in the future
//The values are sent to this function in the form of an array of JSON values.
//Look at JSON file uploaded for sample of input
exports.update_car=(req, res, next) =>{
	//current date
	var date_today = ((year*10000)+(month*100)+date%100)
	const id = req.params.carId;
	Car.findById(id).exec().then(car=>{
		for(var i=0;i<car.bookings.length;i++)
		{
			if(date_today<=car.bookings[i]){
				return res.status(404).json({
					message: "There are future bookings, hence car detais cannot be updated"
				})
			}
		}
		
	}).catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
	//values entered as "propName":"key",""value":"your value"
	const updateOps = {};
	for(const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}
	Car.update({_id: id}, {$set:updateOps }).exec()
	.then(result=>{
		res.status(200).json({
			message: ' Car details updated'
		});
		})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}
//Deleting car details if no bookings for the car exist now or in the future
exports.delete_car=(req, res, next) =>{
	var date_today = ((year*10000)+(month*100)+date%100)
	const id = req.params.carId;
	Car.findById(id).exec().then(car=>{
		for(var i=0;i<car.bookings.length;i++)
		{
			if(date_today<=car.bookings[i]){
				return res.status(404).json({
					message: "There are future bookings, hence car cannot be deleted"
				})
			}
		}
		
	}).catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
	Car.remove({_id: id}).exec()
	.then(result =>{
		res.status(200).json({
			message:'Car deleted'
		});

	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});

}
//Filter for displaying car based on criteria like rent, seat_capacity,etc.
//JSON file contains example of all filters
exports.filter_car=(req,res,next)=>{
	const filter = String(req.params.filter);
	const value = Number(req.params.value);

	if(filter == "rent"){
		Car.find({$or:[{'rent':{$lte : value}}]})
		.select('_id vehicle_no rent model seat_capacity bookings')
		.exec()
		.then(doc => {
		if(doc){
			res.status(200).json({
			car: doc,
		});
		}
		else{
			res.status(404).json({
				message: "No cars found"
			});
		}
	}).catch(err=>{
			console.log(err);
			res.status(500).json({
			error:err
		});
	});
	}
	else if(filter == "model"){
		Car.find({$or:[{'model':req.params.value}]})
		.select('_id vehicle_no rent model seat_capacity bookings')
		.exec()
		.then(doc => {
		if(doc){
			res.status(200).json({
			car: doc,
		});
		}
		else{
			res.status(404).json({
				message: "No cars found"
			});
		}
	}).catch(err=>{
			console.log(err);
			res.status(500).json({
			error:err
		});
	});
	}
	else if(filter == "seat_capacity"){
		Car.find({$or:[{'seat_capacity':{$gte : value}}]})
		.select('_id vehicle_no rent model seat_capacity bookings')
		.exec()
		.then(doc => {
		if(doc){
			res.status(200).json({
			car: doc,
		});
		}
		else{
			res.status(404).json({
				message: "No cars found"
			});
		}
	}).catch(err=>{
			console.log(err);
			res.status(500).json({
			error:err
		});
	});
	}
	else if(filter == "date"){
		Car.find()
		.select('_id vehicle_no rent model seat_capacity bookings')
		.exec()
		.then(doc => {
		Car.find({$or:[{'bookings':value}]}).select('_id bookings')
		.exec()
		.then(docs => {
			for(var i=0;i<docs.length;i++)
			{
				j=0
				k=doc.length
				while(j<k)
				{
					if((docs[i]._id).equals(doc[j]._id)){
						doc.splice(j,1)
						break
					}
					j++
				}
			}
			if(doc){
				res.status(200).json({
					car: doc,
			});
			}
			else{
				res.status(404).json({
					message: "No cars found"
				});
			}
		})
	}).catch(err=>{
			console.log(err);
			res.status(500).json({
			error:err
		});
	});
	}
	else if(filter == "id"){
		Car.findById(req.params.value)
	.select('vehicle_no model _id rent seat_capacity bookings')
	.exec()
	.then(doc=>{
		if(doc){
			res.status(200).json({
			car: doc,
		});
		}
		else{
			res.status(404).json({
				message: "No cars found"
			});
		}
	}).catch(err=>{
			console.log(err);
			res.status(500).json({
			error:err
		});
	});
	}
	else{
			res.status(500).json({
				message:"Invalid filter"
		});
 }
}
