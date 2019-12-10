var apiKeys = require('../config/apikeys.js');


module.exports = function(app, passport, db, io, ObjectId, stringStrip) {
var accountSid = process.env.SID; //apiKeys.accountSid
var authToken= process.env.AUTH; //apiKeys.authToken
    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
      res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      console.log(req.user)
      res.render('profile.ejs', {
        user: req.user
      })
    })
    // gets question and answer page
    app.get('/q&a', isLoggedIn, function(req, res) {
      db.collection('questions').find().toArray((err, result) => {
        // console.log(result)
        if (err) return console.log(err)
        console.log('found questions', result.length)
        res.render('qandcomment.ejs', {
          user: req.user,
          questions: result
        })
      })
    })

    app.post('/questions', isLoggedIn, (req, res) => {
      db.collection('questions').save({
        question: req.body.question,
        comment: [],
        user: req.user._id,
        thumbsUp: 0,
        thumbsDown: 0
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved new question to new databse')
        res.redirect('/q&a')
      })
    })


    app.put('/q&a/questions', isLoggedIn, (req, res) => {
      console.log('about to save comment')
      console.log(req.body.question, req.body.comment)
      db.collection('questions')
        .findOneAndUpdate({
          question: req.body.question,
          user: req.user._id
        }, {
          $push: {
            comment: req.body.comment
          }
        }, {
          sort: {
            _id: -1
          },
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
    })

    app.put('/q&a/thumbsUps', isLoggedIn, (req, res) => {
      console.log('about to upvote')
      console.log(req.body.question, req.body.comment, req.body.thumbsUp)

      db.collection('questions')
        .findOneAndUpdate({
          question: req.body.question,
        }, {
          $set: {
            thumbsUp: parseInt(req.body.thumbsUp) + 1
          }
        }, {
          sort: {
            _id: -1
          },

        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
    })

    app.put('/q&a/thumbsdwn', isLoggedIn, (req, res) => {
      console.log('about to upvote')
      console.log(req.body.question, req.body.comment, req.body.thumbsUp)

      db.collection('questions')
        .findOneAndUpdate({
          question: req.body.question,
        }, {
          $set: {
            thumbsUp: parseInt(req.body.thumbsUp) - 1
          }
        }, {
          sort: {
            _id: -1
          },

        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
    })

    app.delete('/q&a/delete', isLoggedIn, (req, res) => {
      console.log("this is the delete", req.body.question, req.user._id)
      db.collection('questions').findOneAndDelete({
        question: req.body.question,
        user: req.user._id
      }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })


    // gets company login page
    app.get('/login', function(req, res) {
      res.render('companyLogin.ejs');
    });
    // chat page
    //  chat box
    app.get('/chat', function(req, res){
    res.render('chat.ejs');
    });
    // app.get('/chat', isLoggedIn, function(req, res) {
    //   let dirname = __dirname.slice(0, -3)
    //   console.log('Chat is working', dirname);
    //   // res.sendFile(dirname + "views" + '/chat.ejs');
    //   res.render('chat.ejs')
    //   console.log(dirname)
    // })
    //
    // io.on('connection', function(socket) {
    //   socket.emit('news', {
    //     hello: 'world'
    //   });
    //   socket.on('my other event', function(data) {
    //     console.log(data);
    //   });
    // });
    // console.log(io.on)
    // io.on('connection', function(socket){
    // console.log('a user connected');
    // socket.on('disconnect', function(){
    //     console.log('user disconnected');
    //   });
    // });


    app.get('/individualResources', isLoggedIn, (req, res) => {
      let Job = req.user.category.toLowerCase()
      db.collection('resources').findOne({
        Job: Job
      }, ((err, result) => {
        // console.log(result)
        if (err) return console.log(err)
        console.log('looking for info on specific job')
        res.render('SimpleInfo.ejs', {
          user: req.user,
          Info: result
        })
      }));
    })

    function removeField(result) {
      // item is the actual items in the array(result) ex: job, facebook
      return result.map((item) => {
        return {
          Job: item.Job,
          FacebookGroups: item.FacebookGroups,
          Websites: item.Websites,
          More: item.More,

        }
      });
    }

    app.post('/homePageInput', (req, res) => {
      console.log(req.body.Job)
      db.collection('resources').find({
        Job: req.body.Job
      }).toArray((err, result) => {
        // console.log(result)
        if (err) return console.log(err)
        console.log('looking for job in main input')
        res.render('SimpleInfo.ejs', {
          user: req.user,
          Info: removeField(result)
        })
      })
    })


    // This is beginning of job posts and job board page

    // company adds to jobboard when logged in or signup get redirected here to begin adding jobs
    app.get('/postJobs', isLoggedIn,function(req, res) {
      console.log(req.user.PhoneNumber)
      console.log("this is the username:",req.user.local.username)
      var client =require('twilio')(accountSid,authToken)
      let numberTo= req.user.PhoneNumber
      let name= req.user.local.username
      client.messages
        .create({
           body: `Thank you ${name} for signing up to degreein and thank you for coming to DemoDay.It was a pleasure speaking to you and hope to connect with you again soon!`,
           from: '+12053464383',
           to: numberTo
         })
        .then(message => console.log(message.sid));

      let user= new ObjectId(req.user._id)
      console.log("this is the company user:",user)
      db.collection('users').find({user}).toArray((err, result) => {
        console.log('this is the results of jobPosts', result)
      res.render('companyJobadd.ejs',{
        user:req.user
      })
      })
    });



    app.get('/jobposts', isLoggedIn, function(req, res) {
      db.collection('jobpostings').find().toArray((err, result) => {
        console.log('this is the results of jobPosts', result)
        if (err) return console.log(err)

        res.render('jobboard.ejs', {
          jobposting: result,
          user: req.user
        })
      })
    });
    // app.get('/nonloggedIn', function(req, res) {
    //   db.collection('jobpostings').find().toArray((err, result) => {
    //     console.log('this is the results of jobPosts', result)
    //     if (err) return console.log(err)
    //
    //     res.render('jobboard.ejs', {
    //       jobposting: result,
    //       user: req.user
    //     })
    //   })
    // });


    // app.get('/testTwillio', function(req,res){
    //   client.messages
    //     .create({
    //        body: 'Thank you  for signing up tp ',
    //        from: '+12053464383',
    //        to: '+17814921879'
    //      })
    //     .then(message => console.log(message.sid));
    // })

    // Companies post jobs saves to database
    app.post('/postJobs', (req, res) => {
      console.log("hi: " + req.body.role, stringStrip(req.body.description), stringStrip(req.body.responsibilities))

      let role = req.body.role.toLowerCase()
      let company = req.body.company.toLowerCase()
      let location = req.body.location.toLowerCase()
      if (role) {
        db.collection('jobpostings').save({
          role,
          company,
          location,
          description: stringStrip(req.body.description),
          Url: req.body.Url,
          responsibilities: stringStrip(req.body.responsibilities)
        }, (err, result) => {
          console.log(result)
          if (err) return console.log(err)
          console.log('companies posted jobs')
          res.render('companyJobadd.ejs')
        })
      } else {
        res.render('companyJobadd.ejs', {
          message: req.flash('Empty Form')
        })
      }
      // console.log('this is role in postjobs',role,company,location)
      //
      // console.log('This is the url',req.body.Url)
    })
    // users searches for job
    app.post('/jobpostssearch', isLoggedIn, function(req, res) {
      console.log("this is before the tolowercase", req.body.search)
      let search = req.body.search.toLowerCase()
      let location = req.body.location.toLowerCase()
      console.log("this is after to lowercase", search)
      const filter = {}
      if (search) {
        filter.role = new RegExp(search)
        console.log("this is in the if statement", filter.role)
      }
      if (location) {
        filter.location = new RegExp(location)
      }
      // check the text operator mongodb for combining the strings when doing the search
      db.collection('jobpostings').find(filter).toArray((err, result) => {
        console.log('this is the results', result, filter)
        if (err) return console.log(err)

        res.render('jobboard.ejs', {
          user: req.user,
          jobposting: result
        })
      })
    });


    //  this gets the description of each role when clicked
    app.get('/roledescription', isLoggedIn, function(req, res) {
      console.log('this is the description query', req.query.role)
      db.collection('jobpostings').findOne({
        role: req.query.role
      }, (err, result) => {
        console.log('this is the results', result)
        if (err) return console.log(err)

        res.render('roledescription.ejs', {
          user: req.user,
          jobdescription: result
        })
      })
    });

    //  SAVE Favorite JOBS
    app.put('/savedJob', isLoggedIn, (req, res) => {
      console.log('about to save comment')
      console.log("favorite jobs", req.body.userId, req.body.jobId)
      db.collection('users')
        .findOneAndUpdate({
          user: req.user.userId
        }, {
          $addToSet: {
            savedJobs: new ObjectId(req.body.jobId)
          }
        }, {
          sort: {
            _id: -1
          },
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
    })

    // Get savedJobs
    app.get('/savedJobs', isLoggedIn, function(req, res) {
        let user = ObjectId(req.user._id)
        // let savedJobs= []
        // let jobListings= []
        const filter ={ "$or":[] }
        const toArray= filter["$or"]
        console.log("save jobs clicked", user)
        db.collection('users').findOne({
            _id: new ObjectId(req.user._id)
          }, (err, result) => {
            // takein gresult from first collection trying to now be more specific of what i want from result
            console.log('original result from user', result.savedJobs)
            savedJobs = result.savedJobs

            for (let i =0 ; i<savedJobs.length ; i++){
              toArray.push({_id:  ObjectId(savedJobs[i]._id)})
            }

            console.log("job id filter:!!!!", filter)
              db.collection('jobpostings').find(
                filter
              ).toArray((err, resulttwo) => {

                res.render('savedJobs.ejs',{
                  user: req.user,
                  savedJobs:resulttwo
                })


                console.log("resulttwo!!! from jobcollection", resulttwo)
                if (err) return console.log(err)


              })

            // console.log("Joblisting array!!",jobListings)
            //
            // console.log("this is array of userJobs", result)

          })

        })
        app.post('/savedJobsSearch', isLoggedIn, function(req, res) {
          console.log("this is before the tolowercase", req.body.search)
          let search = req.body.search.toLowerCase()
          let location = req.body.location.toLowerCase()
          console.log("this is after to lowercase", search)
          const filter = {}
          if (search) {
            filter.role = new RegExp(search)
            console.log("this is in the if statement", filter.role)
          }
          if (location) {
            filter.location = new RegExp(location)
          }
          // check the text operator mongodb for combining the strings when doing the search
          db.collection('jobpostings').find(filter).toArray((err, result) => {
            console.log('this is the results', result, filter)
            if (err) return console.log(err)

            res.render('savedJobs.ejs', {
              user: req.user,
              savedJobs: result
            })
          })
        });

      // FRIENDS
      app.get('/friends', isLoggedIn, function(req, res) {
        console.log(req.user.category)

        db.collection('users').find({
          category: req.user.category,
          public: true,
          _id: {
            $ne: new ObjectId(req.user._id)
          }
        }).toArray((err, result) => {
          console.log('this is the results', result)
          if (err) return console.log(err)
          console.log(result)
          res.render('friends.ejs', {
            friends: result
          })
        })
      });
      //

      //  from main page click on compnaies in nav bar
      app.get('/companies', function(req, res) {
        res.render('companyLogin.ejs');
      });


      // app.get('/jobBoard', function(req, res) {
      //     res.render('jobBoard.ejs');
      // });

      // LOGOUT ==============================
      app.get('/logOut', function(req, res) {
        req.logout();
        res.redirect('/');
      });
      //
      // // message board routes ===============================================================

      //
      // // =============================================================================
      // // AUTHENTICATE (FIRST LOGIN) ==================================================
      // // =============================================================================
      //
      //     // locally --------------------------------
      // LOGIN ===============================
      // show the login form
      // User login
      app.get('/Userlogin', function(req, res) {
        res.render('login.ejs', {
          message: req.flash('loginMessage')
        });
      });

      // process the login form
      app.post('/Userlogin', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/Userlogin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      }));
      //
      // // SIGNUP =================================
      // show the signup form User signup
      app.get('/Usersignup', function(req, res) {
        res.render('signup.ejs', {
          message: req.flash('signupMessage')
        });
      });

      // process the signup form
      app.post('/Usersignup', passport.authenticate('local-signup', {

        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/Usersignup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      }));
      //  gets the companies signup page
      app.get('/companySignup', function(req, res) {

        res.render('companySignup.ejs', {
          message: req.flash('signupMessage')
        });
      });
      // company signUp
      app.post('/companySignup', passport.authenticate('local-signup', {

        successRedirect: '/postJobs', // redirect to the secure profile section
        failureRedirect: '/companySignup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages

      }));

      app.get('/companyLogin', function(req, res) {
        res.render('companyLogin.ejs', {
          message: req.flash('signupMessage')
        });
      });

      app.post('/companyLogin', passport.authenticate('local-login', {

        successRedirect: '/postJobs', // redirect to the secure profile section
        failureRedirect: '/companyLogin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
      }));


      //
      // // =============================================================================
      // // UNLINK ACCOUNTS =============================================================
      // // =============================================================================
      // // used to unlink accounts. for social accounts, just remove the token
      // // for local account, remove email and password
      // // user account will stay active in case they want to reconnect in the future

      // local -----------------------------------
      // app.get('/unlink/local', isLoggedIn, function(req, res) {
      //     var user            = req.user;
      //     user.local.email    = undefined;
      //     user.local.password = undefined;
      //     user.save(function(err) {
      //         res.redirect('/profile');
      //     });
      // });

    };

    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
        return next();

      res.redirect('/');
    }
