const app = require('./app');
const https = require('https');
const fs = require('fs');
// const options = {
//   key: fs.readFileSync('../cert/cert.key', 'utf-8'),
//   cert: fs.readFileSync('../cert/cert.crt', 'utf-8'),
// };
//openssl, wygenerowanie klucza, wykstraktowanie, nastawienie opcji portu


const port = 3000
const privateKey = fs.readFileSync( './views/public/cert/cert.key' );
const certificate = fs.readFileSync( './views/public/cert/cert.crt' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port , function(error) {
  if(error) 
  console.log('Something went wrong!')
  else
  console.log('Connect to server is successfully')
})


