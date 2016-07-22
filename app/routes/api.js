var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

var superSecret = config.secret;

module.exports = function(app, express) {

  var apiRouter = express.Router();

  apiRouter.post('/authenticate', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function(err, user) {
      console.log('user');
      console.log(user);

      console.log('err');
      console.log(err);
      if (err) throw err;

      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password'
          });
        } else {
          var token = jwt.sign({
              name: user.name,
              username: user.username
            },
            superSecret, {
              expiresIn: "24h" //24 hour expiry
            }
          );

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  });

  //middleware to use for all requests
  apiRouter.use(function(req, res, next) {
    //logging
    console.log('Someone is using our API');
    //need to authenticate users
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  });

  apiRouter.get('/', function(req, res) {
    res.json({
      message: 'horray! welcome to api!'
    });
  });

  apiRouter.route('/users')
    .post(function(req, res) {
      // create a new instance of the User model
      var user = new User();
      // set the users information (comes from the request)
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;
      console.log(req.body);
      // save the user and check for errors
      user.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({
              success: false,
              message: 'A user with that username already exists. '
            });
          else
            return res.send(err);
        }
        res.json({
          message: 'User Created'
        });
      });
    })

  .get(function(req, res) {
    User.find(function(err, users) {
      res.json(users);
    });
  });

  apiRouter.route('/users/:user_id')
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);
        res.json(user);
      });
    })

  .put(function(req, res) {
      console.log("in PUT");
      User.findById(req.params.user_id, function(err, user) {
        if (err) {
          console.log("error here");
          res.send(err);
        }
        console.log(user);

        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        user.save(function(err) {
          if (err) res.send(err);
          res.json({
            message: 'User updated!'
          });
        });
      });
    })
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) return res.send(err);
        res.json({
          message: 'Successfully deleted'
        });
      });
    });

  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;
};
