// load up the user model
var User            = require('./models/user');
var Compendium            = require('./models/compendium');
var Insect           = require('./models/insect');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// img path
var imgPath = __dirname+'/public/images/Carabus nemoralis lehtokiitäjäinen tv20130514_009.jpg';

// example schema
var schema = new Schema({
    img: { data: Buffer, contentType: String }
});

// our model
var A = mongoose.model('A', schema);

// app/routes.js
module.exports = function(app, passport) {

	app.get('/image-test', function(req, res) {

	 // empty the collection
    A.remove(function (err) {
    if (err) throw err;

    console.error('removed old docs');

    // store an img in binary in mongo
    var a = new A;
    a.img.data = fs.readFileSync(imgPath);
    a.img.contentType = 'image/png';
    a.save(function (err, a) {
      if (err) throw err;

      console.error('saved img to mongo');
		A.findById(a, function (err, doc) {
          if (err) return next(err);
          res.contentType(doc.img.contentType);
          res.send(doc.img.data);
      });
      });
	});
});

app.get('/populate_db', function(req, res) {
	 console.log('populate_db');
	 fs.readFile(__dirname+'/public/insects/kovakuoriaiset.json', 'utf8', function (err, data) {
	
		
		 var insects = JSON.parse(data);
		 //console.log(insects);
		 //res.send(insects);
		 //insects.splice(1, 1);
		 var i = 0;
		 console.log('insects.length: '+ insects.length);
			 
		 for (var i=0; i<insects.length; i++) {
		 	console.log(insects[i]);
    		for (var name in insects[i]) {
        		console.log("Item name: "+name);
        		console.log("Prop: "+insects[i][name]);
        		
        	}
    	}
    	 
	 // empty the collection
    Insect.remove(function (err) {
    	 if (err) throw err;
		 for (var i=0; i< insects.length; i++) {
		 		var insect = insects[i]; 
		
		 		console.log(insect['Name']+ ' '+insect.Name);
		 		var newInsect = new Insect();
				newInsect.name=insect['Name'];
				newInsect.latinName=insect['LatinName'];
				newInsect.legs=insect['Legs'];
				newInsect.territory=insect['Territory'];
				newInsect.primaryColor=insect['PrimaryColor'];
				newInsect.secondaryColor=insect['SecondaryColor'];
				newInsect.wiki=insect['Wiki'];
				newInsect.image=insect['Image'];
				newInsect.category=insect['Category'];
				
		 		
		 		console.log('newInsect: '+newInsect);
		 		newInsect.save(function (err) {
		 			if (err) throw err;
		 			console.log('Insect saved');
		 		});
		 		
	     }
	  });  		 
	 });
	 res.sendFile('index.html');
	  	
 });	
 
app.get('/insect/search', function (req, res) {
	
/*	
	var filteredQuery = {},
  		acceptableFields = ['primaryColor', 'secondaryColor', 'category', 'legs' ];
  		

	if(typeof req.query[acceptableFields[0]] == 'undefined' && typeof req.query[acceptableFields[1]] == 'undefined' && 
		typeof req.query[acceptableFields[2]] == 'undefined' && typeof req.query[acceptableFields[3]] == 'undefined') 
		res.redirect("/insect/list");
	*/	
	var primaryColor = req.query.primaryColor;	
	var secondaryColor = req.query.secondaryColor;
	var category =req.query.category;
	var legs = req.query.legs;
	
	var query = Insect.find();
	if (req.query.primaryColor) {
		query.where('primaryColor').equals(primaryColor);	
	}	
	if (req.query.SecondaryColor) {
		query.where('secondaryColor').equals(secondaryColor);	
	}	
	if (req.query.category) {
		query.where('category').equals(category);	
	}	
	if (req.query.legs) {
		query.where('legs').equals(legs);	
	}	
	
	console.log("searching");
	query.exec(function(err, insects) {
		if (err) throw err;
		console.log(insects);
		console.log(JSON.stringify(insects));
		res.send(insects);
	});
	/*
	for (int i = 0; i < acceptableFields.length; i++) {
		acceptableFields[i]
	}
	
	console.log("querying");
	var query = Insect.find(filteredQuery);
	
	console.log("searching...  ");
	query.exec(function(err, insects) {
		if (err) throw err;
		console.log(insects);
		res.send(insects);
	});*/
	

	
	/*
	console.log('query: '+query);
		console.log("searching...  ");	
	if (req.query.primaryColor && req.query.category) {
		Insect.find({$and: [{primaryColor: {$eq:req.query.primaryColor}}, {category: {$eq: req.query.category}}]},
		 	function(err, insects) {
		
			//console.log("insects: "+insects);
			if (err) throw err;
			console.log("insects: "+insects);
			res.send(insects);		
		});
	}*/

	/*
	if (req.query.primaryColor && !req.query.category) {
		Insect.find( {primaryColor: {$eq:req.query.primaryColor}},
		 	function(err, insects) {
		
			//console.log("insects: "+insects);
			if (err) throw err;
			console.log("insects: "+insects);
			res.send(insects);		
		});
	}	*/
	
	
	
		

		//query: {primaryColor: {$eq:"Green"}},{category: {$eq: "Beetle"}}

	//Insect.find({$and: [query]}, function(err, insects) {
/*		Insect.find({$and: [{primaryColor: {$eq:"Green"}}, {category: {$eq: "Beetle"}}]},
		 function(err, insects) {
		
		//console.log("insects: "+insects);
		if (err) throw err;
		console.log("insects: "+insects);
		res.send(insects);		
	});*/

	
}); 
 
 app.get('/insect/list', function(req, res) {
	 
	 	Insect.find({}, function (err, insects) {
    		if (err) {
				console.log(err);
			} 
    		    		
			console.log('found insects: '+insects);
			res.send(insects);    	
    	});
    	
 });
 
 
 app.get('/collection/list', function(req, res) {
	 	if (req.isAuthenticated()) {
	 	Compendium.findOne({'_user': req.user.id}, function (err, compendium) {
    		if (err) {
				console.log(err);
			} 
    		    	
			console.log('found compendium: '+compendium);
			
			// find the insects
			                              
			Insect.find({"_id":	{$in: compendium.insects}}, function (err, insects) {
				if (err) throw err;
				
				console.log('found insects in a user collection');
				
				res.send(insects);
			})
    	});
    }
    	
 });
 app.get('/collection/insert', function(req, res) {
	//Compendium.remove(function(err) {});		
		User.findOne({ 'local.email' :  req.user.email}, function(err, user) {
		
  			if (err) {
  			 console.log(err);
  			}
  			// find the user's collection
  			console.log('user: '+req.user.id);
  			
  			console.log('insectId: '+req.query.insectId);
  			Compendium.findOne({'_user': req.user.id}, function(err, compendium) {
  				console.log('found a user\'s compendium');
  				if (compendium) {
  					console.log('updating a collection');
					compendium.insects.push(req.query.insectId);
					console.log('updated compendium: '+compendium);
					compendium.save(function (err) {
						if (err) throw err;
						console.log('updated compendium item');
					});				
				}
				else {

					// create a new collection
					console.log('creating a new collection');
					var newCompendium = new Compendium();
					newCompendium._user = req.user.id;
					console.log('newCompendium.insects: '+newCompendium.insects);
					newCompendium.insects.push(req.query.insectId); 
					//newCompendium.insects.push(req.params.insectId);
					//newCompendium._user=req.user.id;
					console.log('newCompendium: '+newCompendium);
					newCompendium.save(function (err) {
						if (err) throw err;
						console.log('saved compendium item');
					});
					
				}
				
			  Compendium.find({}, function(err, compendiums) {
 				if (err) throw err;
 					console.log('compendiums: '+compendiums);
 					res.send(compendiums);
 				});
			});
			console.log('after searching a user\'s collection');
 		});
 		
 	});
	 

	 // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
    	  res.sendFile('index.html');
    });
	 // a full list of insects    
    app.get('/user/list', function(req, res) {
    	// get all the insects
    	
    	var email = 'mauri.f@suomi.fi';
    	console.log("before database record is created");
    	
    	var insectCollection= new Insect();
    	console.log("after database record creation");
    	
    	Insect.find({}, function (err, insects) {
    		if (err) {
				console.log(err);
			} 
    		    		
			console.log('found insects: '+insects);    	
    	});
    	User.findOne({ 'local.email' :  email }, function(err, user) {
		//user.find({}, function(err, insects) {
  			if (err) {
  			 console.log(err);
  			}
			// object of all the users
			console.log('found user: '+user);
			res.send(user);  
		});
			
			
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/#/main', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

   // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}