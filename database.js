const database = () => {

    const mongoose = require('mongoose');
    const url = 'mongodb://127.0.0.1:27017/Koło_fortuny';

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true

    }, (err) => {
        console.log('database is connected');
        if (err) console.log(err);
    })
}
module.exports = database;

