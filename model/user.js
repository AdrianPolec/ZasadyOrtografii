const mongoose = require('mongoose');


const User = new mongoose.Schema({
    nazwa: {
        type: String,
    },
    imie: {
        type: String
    },
    nazwisko: {
        type: String
    },
    email: {
        type: String,
    },
    haslo: {
        type: String
    },
    hasloconf: {
        type: String
    }
});
const userModel = mongoose.model('User', User, 'Users');

module.exports = userModel;
