var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;

var InsectSchema = new Schema({

	name: String,
	latinName:String,
	wiki: String,
	territory: [String],
	primaryColor: String,
	secondaryColor: String,
	legs: Number,
	category: String,
	images: [String],
	imageLinks: [String],
});

//module.exports = mongoose.model('Insect', InsectSchema);

module.exports = mongoose.model('insects', InsectSchema);