var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// import { isEmail } from 'validator/lib/isEmail';
var isEmail = require( 'validator/lib/isEmail');





// var validateEmail = function(email) {
//   var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   return re.test(email)
// };


var userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String, 
      validate: [ isEmail, 'invalid email' ]
      // required: 'Email address is required',
      // validate: [validateEmail, 'Please fill a valid email address'],
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    password: {
      type: String,  required: true
    }
   
  }
  
)





userSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next()
  };
  bcrypt.hash(user.password, 10).then((hashedPassword) => {
    user.password = hashedPassword;
    next();
  })
}, function (err) {
  next(err)
})
userSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return next(err);
    next(null, isMatch)
  })
}
module.exports = mongoose.model("user", userSchema);