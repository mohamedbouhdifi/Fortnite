var express = require('express');
var router = express.Router();
var User = require('../models/user');
const hashUtils = require('../utils/hashUtils');


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
						const hashedPassword = hashUtils.hash(personInfo.password);

						var newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: hashedPassword,
							ProfilePic: "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg",
							Fortnite: {
								childFortniteSchema: {
									Favskins: [Object],
									BlacklistSkins: [Object],

								},
							},
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
	User.findOne({ email: req.body.email }, function (err: any, data: any) {
		if (data) {
			hashUtils.comparePassword(req.body.password, data.password, function (err: any, isMatch: any) {
				if (err) {
					return res.send({ "Success": "Error occurred while comparing passwords" });
				}
				if (isMatch) {
					req.session.userId = data.unique_id;
					return res.send({ "Success": "Success!" });
				} else {
					return res.send({ "Success": "Wrong password!" });
				}
			});
		} else {
			return res.send({ "Success": "This Email Is not registered!" });
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
			return res.render('Homepage', { "name": data.username, "email": data.email, "Profile": data.ProfilePic });
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
			return res.render('FavouritePage', { "name": data.username, "email": data.email, "FavSkins": data.Fortnite.Favskins, "Profile": data.ProfilePic });
		}
	});
})

//Make FavouriteSkin route to post request	
router.post("/FavSkins", (req: any, res: any) => {
	console.log("FavouriteSkin");
	console.log(req.body);
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		if (!data) {
			res.redirect('/Login');
		} else {
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');

			const existingSkin = data.Fortnite.Favskins.find((skin: any) => skin.skinTitle === req.body.name);
			if (existingSkin) {
				console.log('Skin is already Favourited');
			} else {
				const newFavouriteSkin = {
					skinTitle: req.body.name,
					description: req.body.description,
					imageProfile: req.body.imageProfile,
					image: req.body.image,
					pickaxe: "",
					emote: "",
					notes: "Type your notes here",
					wins: 0,
					losses: 0,
				};
				data.Fortnite.Favskins.push(newFavouriteSkin);
				console.log('Skin has been Favourited');
			}
			data.save((err: any) => {
				if (err) {
					console.log(err);
					// handle error
				} else {
					console.log('User data updated successfully');
					// render response
					return res.render('FavouritePage', { "name": data.username, "email": data.email, "FavSkins": data.Fortnite.Favskins, "Profile": data.ProfilePic });
				}
			});
		}
	});
})

router.post("/UpdateW-L/:skinTitle", (req: any, res: any) => {
	console.log("UpdateW-L");
	console.log(req.body);
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		if (!data) {
			res.redirect('/Login');
		} else {
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');

			const existingSkin = data.Fortnite.Favskins.find((skin: any) => skin.skinTitle === req.params.skinTitle);
			if (existingSkin) {
				console.log('Skin is already Favourited');
				existingSkin.wins = req.body.wins;
				existingSkin.losses = req.body.losses;

				if (existingSkin.losses >= 3) {
					// Remove the skin from the array if losses are 3 or more
					data.Fortnite.Favskins = data.Fortnite.Favskins.filter((skin: any) => skin.skinTitle !== req.params.skinTitle);

					// Add the skin to the blacklist
					const blacklistedSkin = {
						skinTitle: existingSkin.skinTitle,
						description: existingSkin.description,
						imageProfile: existingSkin.imageProfile,
						image: existingSkin.image,
						reason: "Excessive losses"
					};
					data.Fortnite.BlacklistSkins.push(blacklistedSkin);
				}
			} else {
				console.log('Skin is not Favourited');
			}

			data.save((err: any) => {
				if (err) {
					console.log(err);
					// handle error
				} else {
					console.log('User data updated successfully');
					// render response
					return res.render('FavouritePage', { "name": data.username, "email": data.email, "FavSkins": data.Fortnite.Favskins, "Profile": data.ProfilePic });
				}
			});
		}
	});
});


//update notes for favourite skin
router.post("/UpdateNotes/:Title", (req: any, res: any) => {
	console.log("UpdateNotes");
	console.log(req.body);
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		if (!data) {
			res.redirect('/Login');
		} else {
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');

			const existingSkin = data.Fortnite.Favskins.find((skin: any) => skin.skinTitle === req.params.Title);
			if (existingSkin) {
				console.log('Skin is already Favourited');
				existingSkin.notes = req.body.notes;
			} else {
				console.log('Skin is not Favourited');
			}
			data.save((err: any) => {
				if (err) {
					console.log(err);
					// handle error
				} else {
					console.log('User data updated successfully');
					// render response
					return res.render('FavouritePage', { "name": data.username, "email": data.email, "FavSkins": data.Fortnite.Favskins, "Profile": data.ProfilePic });
				}
			});
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
			return res.render('BlacklistPage', { "name": data.username, "email": data.email, "BlacklistSkins": data.Fortnite.BlacklistSkins, "Profile": data.ProfilePic });
		}
	});

})

// make BlacklistSkin route to post request
router.post("/BlacklistSkin", (req: any, res: any) => {
	console.log("BlacklistSkin");
	console.log(req.body);
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		if (!data) {
			res.redirect('/Login');
		} else {
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');

			const existingSkin = data.Fortnite.BlacklistSkins.find((skin: any) => skin.skinTitle === req.body.name);
			if (existingSkin) {
				console.log('Skin is already blacklisted');
			} else {
				const newBlacklistSkin = {
					skinTitle: req.body.name,
					description: req.body.description,
					imageProfile: req.body.imageProfile,
					image: req.body.image,
					reason: req.body.reason
				};
				data.Fortnite.BlacklistSkins.push(newBlacklistSkin);
				console.log('Skin has been blacklisted');
			}
			data.save((err: any) => {
				if (err) {
					console.log(err);
					// handle error
				} else {
					console.log('User data updated successfully');
					// render response
					return res.render('BlacklistPage', { "name": data.username, "email": data.email, "BlacklistSkins": data.Fortnite.BlacklistSkins, "Profile": data.ProfilePic });
				}
			});
		}
	});
});

//update reason for blacklisted skin
router.post("/Update/:Title", (req: any, res: any) => {
	console.log("UpdateReason");
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

			const existingSkin = data.Fortnite.BlacklistSkins.find((skin: any) => skin.skinTitle === req.params.Title);
			if (existingSkin) {
				existingSkin.reason = req.body.reason;
			} else {
				console.log('Skin is not blacklisted');
			}
			data.save((err: any) => {
				if (err) {
					console.log(err);
					// handle error
				} else {
					console.log('User data updated successfully');
					// render response
					return res.render('BlacklistPage', { "name": data.username, "email": data.email, "BlacklistSkins": data.Fortnite.BlacklistSkins, "Profile": data.ProfilePic });
				}
			});
		}
	});

})

//delete blacklisted skin
router.get("/Delete/:Title", (req: any, res: any) => {
	console.log("DeleteBlacklistedSkin");
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

			const existingSkin = data.Fortnite.BlacklistSkins.find((skin: any) => skin.skinTitle === req.params.Title);
			if (existingSkin) {
				data.Fortnite.BlacklistSkins = data.Fortnite.BlacklistSkins.filter((skin: any) => skin.skinTitle !== req.params.Title);
			} else {
				console.log('Skin is not blacklisted');
			}
			data.save((err: any) => {
				if (err) {
					console.log(err);
					// handle error
				} else {
					console.log('User data updated successfully');
					// render response

					res.render('BlacklistPage', { "name": data.username, "email": data.email, "BlacklistSkins": data.Fortnite.BlacklistSkins, "Profile": data.ProfilePic });

				}
			});
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

			return res.render('Profile', { "name": data.username, "email": data.email, "Profile": data.ProfilePic,message: '' });
		}
	});

})

// Add the following route handler after the "Profile" route handler
router.post('/profile/update', function (req: any, res: any, next: any) {
	const userId = req.session.userId;
	const currentPassword = req.body['current-password'];
	const newPassword = req.body['new-password'];
	const confirmPassword = req.body['confirm-password'];
	const username = req.body.username;

	// Find the user by unique_id and validate current password
	User.findOne({ unique_id: userId }, function (err: any, user: any) {
		if (err) {
			return res.send({ "Success": "An error occurred while updating the profile." });
		}

		if (!user) {
			return res.send({ "Success": "User not found." });
		}

		// Compare the current password with the stored password hash
		hashUtils.comparePassword(currentPassword, user.password, function (err: any, isMatch: any) {
			if (err) {
				return res.send({ "Success": "An error occurred while comparing passwords." });
			}

			if (!isMatch) {
				return res.send({ "Success": "Current password is incorrect." });
			}

			// Check if a new password is provided and validate it
			if (newPassword) {
				if (newPassword !== confirmPassword) {
					return res.send({ "Success": "New password and confirm password do not match." });
				}

				// Hash the new password
				const hashedNewPassword = hashUtils.hash(newPassword);
				user.password = hashedNewPassword;
			}

			// Update the username
			user.username = username;

			// Save the updated user
			user.save(function (err: any) {
				if (err) {
					return res.send({ "Success": "An error occurred while updating the profile." });
				}
				// Update the success message after saving the profile
				return res.render('Profile', { name: user.username, email: user.email, Profile: user.ProfilePic, message: 'Profile updated successfully!' });

			});
		});
	});
});

router.post("/UpdateProfile/:Title", (req: any, res: any) => {
	console.log("UpdateProfile");
	User.findOne({ unique_id: req.session.userId }, function (err: any, data: any) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/Login');
		} else {
			console.log("found");
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');

			const existingSkin = data.Fortnite.Favskins.find((skin: any) => skin.skinTitle === req.params.Title);
			if (existingSkin) {
				data.ProfilePic = existingSkin.imageProfile;
			} else {
				console.log('Skin is not Favourited');
			}
			data.save((err: any) => {
				if (err) {
					console.log(err);
					// handle error
				} else {
					console.log('User data updated successfully');
					// render response
					return res.render('FavouritePage', { "name": data.username, "email": data.email, "FavSkins": data.Fortnite.Favskins, "Profile": data.ProfilePic });
				}
			});
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
			return res.render('PrivacyPolicy', { "name": data.username, "email": data.email, "Profile": data.ProfilePic });
		}
	});

})

module.exports = router;