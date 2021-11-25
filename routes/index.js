const express = require('express');
const router = express.Router();
const FbUser = require('../model/fbuser');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let dataR;
let dataL;
let dataFB;
let user;

function UserFB(imie_i_nazwisko, ID, accessToken, expTime) {
    return {
        imie_i_nazwisko,
        ID,
        accessToken,
        expTime,
    };
}

const createUser = async (dataR) => {
    try {
        console.log(dataR);
        user = new User(dataR);
        await user.save();
        console.log(`Pomyślnie zapisano: ${user.nazwa}`);
    } catch (error) {
        console.log(`terror:${error}`);
        throw error;
    }
};
const createFbUser = async (dataFB) => {
    try {
        console.log(dataFB);
        const fbuser = new FbUser(dataFB);
        await fbuser.save();
    } catch (error) {
        console.log(`terror:${error}`);
        throw error;
    }
};
const hashPassword = (dataR) => {

    bcrypt.hash(dataR.haslo, saltRounds, function (err, hash) {
        dataR.haslo = hash;
        createUser(dataR);

    });
};

router.get('/', function (req, res) {

    res.redirect('/home');

});
router.get('/home', function (req, res) {

    if (req.session.user === 2 || req.session.user === 'FB') {
        res.sendFile('home.html', {
            root: 'views'
        });
    } else {
        res.redirect('/login');
    }
});


router.get('/login', function (req, res) {

    if (req.session.user === 2 || req.session.user === 'FB') {
        res.redirect('/');
        console.log(req.session.user);
    } else {
        res.sendFile('login.html', {
            root: 'views'
        });
    }
});
router.post('/r', (req, res) => {

    dataR = {nazwa, imie, nazwisko, email, haslo, hasloconf} = req.body;

    User.findOne({'nazwa': dataR.nazwa}, (err, user) => {
        if (user === null) {
            User.findOne({'email': dataR.email}, (err, user) => {
                if (user === null) {
                    hashPassword(dataR);
                    res.json({
                        url: '/registered'
                    });

                } else if (err) {
                    console.log(err);
                } else {
                    res.json({
                        mailinfo: 'Użytkownik o podanym adresie email juz istnieje.'
                    })
                }
            });
        } else if (err) {
            console.log(err);
        } else {
            res.json({
                nazwainfo: 'Użytkownik o podanej nazwie juz istnieje.'
            })
        }
    });
});
router.post('/l', (req, res) => {

    dataL = {login, haslo} = req.body;


    User.findOne({'nazwa': dataL.login}, (err, user) => {
        if (user === null) {
            res.json({
                textUserName: 'Błędna nazwa użytkownika.',
            });
        } else if (err) {
            console.log(err + 'Err1');
        } else {
            console.log(user);
            bcrypt.compare(dataL.haslo, user.haslo, (err, result) => {
                console.log(result);
                if (result === false) {
                    res.json({
                        textPassword: 'Błędne hasło.'
                    })
                } else if (result) {
                    req.session.user = 2;
                    res.json({
                        url: '/home',
                    });
                } else {
                    console.log(err + 'Err2');
                }
            });
        }
    });
});
router.post('/Fbl', function (req, res) {

    dataFB = {FBresponse, FBresponseStatus, FBuserName} = req.body;
    const myDate = new Date();
    if (dataFB.FBresponseStatus === 'connected') {

        const timestamp = new Date();
        const expiredOut = dataFB.FBresponse.data_access_expiration_time / 1000 / 60 / 60 / 24;
        timestamp.setDate(timestamp.getDate() + expiredOut);

        FbUser.findOne({'ID': dataFB.FBresponse.userID}, (err, user) => {
            if (user === null) {

                console.log(timestamp);
                fbuser = new UserFB(dataFB.FBuserName, dataFB.FBresponse.userID, dataFB.FBresponse.accessToken, timestamp)

                console.log(fbuser);
                createFbUser(fbuser);
                req.session.user = 'FB';
                res.json({
                    url: '/home',
                })

            } else if (err) {
                console.log(err);
            } else {
                console.log(myDate.getTime() / 1000 / 60 / 60 / 24);
                console.log(user.expTime.getTime() / 1000 / 60 / 60 / 24);
                if (user.expTime.getTime() > myDate.getTime()) {
                    console.log('token jeszcze nie wygasł');
                    req.session.user = 'FB';
                    res.json({
                        url: '/home',
                    })
                } else {
                    console.log('token zostal odnowiony')
                    user.accesToken = dataFB.FBresponse.accessToken;
                    user.expTime = timestamp;
                    user.save();
                    req.session.user = 'FB';
                    res.json({
                        url: '/home',
                    })
                }
            }
        });
    }
});
router.get('/registered', function (req, res) {
    res.sendFile('regconf.html', {
        root: 'views'
    });
});
router.get('/r/passed', function (req, res) {
    const {imie} = dataR;
    res.json({
        imie,
    });
});
router.get('/logout', function (req, res) {

    req.session.user = null;
    res.json({
        url: '/home'
    });
});

module.exports = router;