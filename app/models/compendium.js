	var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;

var CompendiumSchema = new Schema({
	_user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	insects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Insect'}]
});

  
module.exports = mongoose.model('Compendium', CompendiumSchema);