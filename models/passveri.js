var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');





var passveriSchema = new mongoose.Schema({
        email: {
            type: String
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: String
          }
    }
    // {
    //   timestamps: true
    // }
)









module.exports = mongoose.model("passveri", passveriSchema);