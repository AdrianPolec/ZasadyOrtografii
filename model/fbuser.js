const mongoose = require('mongoose');

const FbUser = new mongoose.Schema({
    imie_i_nazwisko: {
        type: String,
    },
    ID: {
        type: Number,
    },
    accessToken: {
        type: String,
    },
    expTime: {
        type: Date,
    }
});

const fbUserModel = mongoose.model('FbUser', FbUser, 'Users');

module.exports = fbUserModel;