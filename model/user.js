const mongoose = require('mongoose');




const User = new mongoose.Schema ({
    nazwa: {
        type: String,
        // unique: true,
        // capitalize: true,
    },
    imie: {
        type: String
    },
    nazwisko: {
        type: String
    },
    email: {
        type: String,
        // unique: true,
        // required: true
    },
    haslo: {
        type: String
    },
    hasloconf: {
        type: String
    }
});


const userModel = mongoose.model('User', User, 'Users');



module.exports =  userModel;
