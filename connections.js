const mysql =require('mysql');

const contacts = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'portfolio'
  });
  
  contacts.connect(err => {
    if(err) console.log(err);
    console.log('MySQL connected...');
  });

  module.exports = contacts;