module.exports = function(app, passport, db,io) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      console.log(req.user)
        res.render('profile.ejs', { user: req.user })
        })
// gets question and answer page
    app.get('/q&a', isLoggedIn, function(req, res) {
            res.render('q&a.ejs')
            })
            // gets company login page
            app.get('/login', function(req, res) {
                res.render('companyLogin.ejs');
            });
// chat page
//  chat box
// app.get('/chat', function(req, res){
// res.sendFile(__dirname + '/chat.ejs');
// });
app.get('/chat', isLoggedIn, function(req, res) {
  let dirname=__dirname.slice(0,-3)
  console.log('Chat is working', dirname);
  // res.sendFile(dirname + "views" + '/chat.ejs');
  res.render('chat.ejs')
  console.log(dirname)
})

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
console.log(io.on)
// io.on('connection', function(socket){
// console.log('a user connected');
// socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });


  app.get('/individualResources', isLoggedIn , (req,res) =>{
    let Job=req.user.category.toLowerCase()
    db.collection('resources').find({Job: Job}).toArray((err, result)  => {
       // console.log(result)
      if (err) return console.log(err)
      console.log('saved to database')
      res.render('SimpleInfo.ejs',{
        Info:result
      })
    })
  })

function removeField(result){
  // item is the actual items in the array(result) ex: job, facebook
  return result.map((item) => {
    return {
      Job: item.Job,
      FacebookGroups: item.FacebookGroups,
      Websites: item.Websites,
    }
  });
}

    app.post('/homePageInput', (req, res) => {
      console.log(req.body.Job)
       db.collection('resources').find({Job: req.body.Job}).toArray((err, result)  => {
          // console.log(result)
         if (err) return console.log(err)
         console.log('saved to database')
         res.render('SimpleInfo.ejs',{
           Info: removeField(result)
         })
       })
     })


     // This is beginning of job posts and job board page

     // company adds to jobboard when logged in or signup get redirected here to begin adding jobs
     app.get('/postJobs', function(req, res) {
         res.render('companyJobadd.ejs');
     });


     app.get('/jobposts', isLoggedIn, function(req, res) {
      db.collection('jobpostings').find().toArray((err, result) => {
        console.log('this is the results', result)
        if (err) return console.log(err)

        res.render('jobboard.ejs', {
          jobposting:result
        })
      })
  });


// Companies post jobs saves to database
     app.post('/postJobs', (req, res) => {
       let role=req.body.role.toLowerCase()
       let company=req.body.company.toLowerCase()
       let location=req.body.location.toLowerCase()
       console.log('this is role in postjobs',role,company,location)

       console.log('This is the url',req.body.Url)
        db.collection('jobpostings').save({role,company,location,description:req.body.description,Url:req.body.Url},(err, result)  => {
           console.log(result)
          if (err) return console.log(err)
          console.log('saved to database')
          res.render('companyJobadd.ejs')
        })
      })
      // users searches for job
    app.post('/jobpostssearch', isLoggedIn, function(req, res) {
          console.log("this is before the tolowercase", req.body.search)
          let search=req.body.search.toLowerCase()
          let location=req.body.location.toLowerCase()
          console.log("this is after to lowercase",search)
          const filter={}
          if(search){
            filter.role=search
            console.log("this is in the if statement" ,filter.role)
          }
          if(location){
            filter.location=location
          }
         db.collection('jobpostings').find(filter).toArray((err, result) => {
           console.log('this is the results', result,filter)
           if (err) return console.log(err)

           res.render('jobboard.ejs', {
             jobposting:result
           })
         })
      });


      //  this gets the description of each role when clicked
      app.get('/roledescription', isLoggedIn, function(req, res) {
       db.collection('jobpostings').findOne({role:req.query.role},(err, result) => {
         console.log('this is the results', result)
         if (err) return console.log(err)

         res.render('roledescription.ejs', {
           jobdescription:result
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
//     // app.post('/messages', (req, res) => {
//     //   db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
//     //     if (err) return console.log(err)
//     //     console.log('saved to database')
//     //     res.redirect('/profile')
//     //   })
//     // })
//     //
//     // app.put('/messages', (req, res) => {
//     //   db.collection('messages')
//     //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     //     $set: {
//     //       thumbUp:req.body.thumbUp + 1
//     //     }
//     //   }, {
//     //     sort: {_id: -1},
//     //     upsert: true
//     //   }, (err, result) => {
//     //     if (err) return res.send(err)
//     //     res.send(result)
//     //   })
//     // })
//     //
//     // app.put('/messages2', (req, res) => {
//     //   db.collection('messages')
//     //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     //     $set: {
//     //       thumbUp:req.body.thumbUp -1
//     //     }
//     //   }, {
//     //     sort: {_id: -1},
//     //     upsert: true
//     //   }, (err, result) => {
//     //     if (err) return res.send(err)
//     //     res.send(result)
//     //   })
//     // })
//     //
//     // app.delete('/messages', (req, res) => {
//     //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
//     //     if (err) return res.send(500, err)
//     //     res.send('Message deleted!')
//     //   })
//     // })
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
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/Userlogin', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/Userlogin', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
//
        // // SIGNUP =================================
        // show the signup form User signup
        app.get('/Usersignup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/Usersignup', passport.authenticate('local-signup', {

            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/Usersignup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        //  gets the companies signup page
        app.get('/companySignup', function(req, res) {
          console.log(req.body.admin)
            res.render('companySignup.ejs', { message: req.flash('signupMessage') });
        });
        // company signUp
        app.post('/companySignup', passport.authenticate('local-signup', {

            successRedirect : '/postJobs', // redirect to the secure profile section
            failureRedirect : '/companySignup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        app.get('/companyLogin', function(req, res) {
            res.render('companyLogin.ejs', { message: req.flash('signupMessage') });
        });

        app.post('/companyLogin', passport.authenticate('local-login', {

            successRedirect : '/postJobs', // redirect to the secure profile section
            failureRedirect : '/companyLogin', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
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
