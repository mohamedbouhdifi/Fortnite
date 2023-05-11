var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get("/", (req: any, res: any) => {
	res.render("LandingPage.ejs");
})

router.get("/Register", (req: any, res: any) => {

	res.render("RegisterPage");
})

router.post('/Register', (req: any, res: any, next: any) => {
	console.log(req.body);
	var personInfo = req.body;


	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, (err: any, data: any) => {
				if (!data) {
					var c;
					User.findOne({}, (err: any, data: any) => {

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						var newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save((err: any, Person: any) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/Login', function (req: any, res: any, next: any) {
	return res.render('LoginPage');
});

router.post('/Login', function (req: any, res: any, next: any) {
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err: any, data: any) {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({ "Success": "Success!" });

			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});


router.get('/Avatars', function (req: any, res: any, next: any) {
	console.log("Avatars");
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/Login');
		} else {
			//console.log("found");
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');
			return res.render('Homepage', { "name": data.username, "email": data.email });
		}
	});
});


router.get('/Logout', function (req: any, res: any, next: any) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err: any) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/Login');
			}
		});
	}
});



router.get("/FavouritePage", (req: any, res: any) => {
	console.log("FavouritePage");
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/Login');
		} else {
			//console.log("found");
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');
			return res.render('FavouritePage', { "name": data.username, "email": data.email });
		}
	});
})




router.get("/BlacklistPage", (req: any, res: any) => {
	console.log("BlacklistPage");
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/Login');
		} else {
			//console.log("found");
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');
			return res.render('BlacklistPage', { "name": data.username, "email": data.email });
		}
	});

})

router.get("/Profile", (req: any, res: any) => {
	console.log("Profile");
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/Login');
		} else {
			//console.log("found");
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');
			return res.render('Profile', { "name": data.username, "email": data.email });
		}
	});

})

router.get("/PrivacyPolicy", (req: any, res: any) => {
	console.log("PrivacyPolicy");
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/Login');
		} else {
			//console.log("found");
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');
			return res.render('PrivacyPolicy', { "name": data.username, "email": data.email });
		}
	});

})

module.exports = router;