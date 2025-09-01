require('dotenv').config();
const contacts = require('./connections')
const express = require("express");
const bodyparser = require('body-parser');
const app = express();
const path = require('path');
const port = 2070;
const nodemailer = require('nodemailer');
const cors = require('cors');


app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail', // you can use any email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  // Insert into database
  const sql = `INSERT INTO portfolio.contacts(name, email, message) VALUES (?, ?, ?)`;
  contacts.query(sql, [name, email, message], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: 'rastogi.sonika1999@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        const timestamp = new Date().toLocaleString();
        return res.status(200).json({
          message: `Thank you, ${name}! Your contact information was saved and email sent successfully on ${timestamp}.`
        });
      }
    });
  });
});







app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
});

