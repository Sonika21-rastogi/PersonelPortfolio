const contacts = require('./connections')
const express= require("express");
const bodyparser = require('body-parser');
const app=express();
const path = require('path');
const port = 2070;

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.json());

app.get('/',(req,res)=>{
 res.sendFile(__dirname +'/index.html');
});

app.get('/submit', (req, res) => {
  res.send("Use POST method to submit contact form.");
});


app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  const sql = `INSERT INTO portfolio.contacts(name, email, message) VALUES (?, ?, ?)`;

  contacts.query(sql, [name, email, message], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    const timestamp = new Date().toLocaleString();
    return res.status(200).json({
      message: `Thank you, ${name}! Your contact information was inserted successfully on ${timestamp}.`
    });
  });
});






app.listen(port,()=>{
console.log(`Server is running on port:${port}` )
});

