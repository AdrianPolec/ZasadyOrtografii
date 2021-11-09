const express = require('express');
const router = express.Router();
const FbUser = require('../model/fbuser')
const User = require('../model/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
let data;
let user;

function UserFB(imie_i_nazwisko, ID, accessToken, expTime) {
    return {
        imie_i_nazwisko,
        ID,
        accessToken,
        expTime,
    }
}


const createUser = async (data) => {
    try {
        console.log(data)
        user = new User(data)
        await user.save();
        console.log(`Pomyślnie zapisano: ${user.nazwa}`);
    } catch (error) {
        throw error
        console.log(`terror:${error}`);
    }
}

const createFbUser = async (data) => {
    try {
        console.log(data)
        const fbuser = new FbUser(data)
        await fbuser.save();
        console.log(`Pomyślnie zapisano: ${fbuser.imie_i_nazwisko}`);
    } catch (error) {
        throw error
        console.log(`terror:${error}`);
    }
}

const hashPassword = (data) => {

    bcrypt.hash(data.haslo, saltRounds, function (err, hash) {
        data.haslo = hash
        createUser(data);

    });

};


router.get('/', function (req, res, next) {

    res.redirect('/home');

});


router.get('/home', function (req, res, next) {

    if (req.session.user === 2 || req.session.user === 'FB') {
        const stronaglowna = 'home.html'
        res.sendFile(stronaglowna, {
            root: 'views'
        });
    } else {
        res.redirect('/login')
    }
})


router.get('/login', function (req, res, next) {

    if (req.session.user === 2 || req.session.user === 'FB') {
        res.redirect('/');
        console.log(req.session.user)
    } else {

        const logowanie = 'login.html'

        res.sendFile(logowanie, {
            root: 'views'
        });
    }
});
router.post('/r', (req, res, next) => {

    data = {nazwa, imie, nazwisko, email, haslo, hasloconf} = req.body;

    User.findOne({'nazwa': data.nazwa}, (err, user) => {
        if (user === null) {
            User.findOne({'email': data.email}, (err, user) => {
                if (user === null) {
                    hashPassword(data)

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
router.post('/l', (req, res, next) => {

    data = {login, haslo} = req.body;


    User.findOne({'nazwa': data.login}, (err, user) => {
        if (user === null) {
            res.json({
                textUserName: 'Błędna nazwa użytkownika.',
            })
        } else if (err) {
            console.log(err + 'adhd')
        } else {
            console.log(user);
            bcrypt.compare(data.haslo, user.haslo, (err, result) => {
                console.log(result)
                if (result === false) {
                    res.json({
                        textPassword: 'Błędne hasło.'
                    })
                } else if (result) {
                    req.session.user = 2;
                    res.json({
                        url: '/home',
                    })
                } else {
                    console.log(err + 'cdba');
                }
            });
        }
    });
});
router.post('/Fbl', function (req, res, next) {

    data = {FBresponse, FBresponseStatus, FBuserName} = req.body
    const myDate = new Date()
    if (data.FBresponseStatus === 'connected') {

        const timestamp = new Date()
        const expiredOut = data.FBresponse.data_access_expiration_time / 1000 / 60 / 60 / 24;
        timestamp.setDate(timestamp.getDate() + expiredOut)

        FbUser.findOne({'ID': data.FBresponse.userID}, (err, user) => {
            if (user === null) {

                console.log(timestamp)
                fbuser = new UserFB(data.FBuserName, data.FBresponse.userID, data.FBresponse.accessToken, timestamp)

                console.log(fbuser)
                createFbUser(fbuser)
                req.session.user = 'FB';
                res.json({
                    url: '/home',
                })

            } else if (err) {
                console.log(err);
            } else {
                console.log(myDate.getTime() / 1000 / 60 / 60 / 24)
                console.log(user.expTime.getTime() / 1000 / 60 / 60 / 24)
                if (user.expTime.getTime() > myDate.getTime()) {
                    console.log('token jeszcze nie wygasł')
                    req.session.user = 'FB';
                    res.json({
                        url: '/home',
                    })
                } else {
                    console.log('sabaka')
                    user.accesToken = data.FBresponse.accessToken;
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
})
router.get('/registered', function (req, res, next) {

    const rejestracja = 'regconf.html'

    res.sendFile(rejestracja, {
        root: 'views'
    });


});
router.get('/r/passed', function (req, res, next) {

    const {imie} = data;
    res.json({
        imie,
    });
});
router.get('/logout', function (req, res, next) {

    req.session.user = null;

    res.json({
        url: '/home'
    });


});


module.exports = router, data;