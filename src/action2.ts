import axios from 'axios';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const port = 3002;

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'lucy89@ethereal.email',
    pass: 'WHtPZ8rRrRxTJbxbRs'
  }
});

app.post('/execute/:id', (req, res) => {
  const mailOptions = {
    from: 'your@gmail.com',
    to: 'recipient@gmail.com',
    subject: 'Email Subject',
    text: `Fake of email to customer`
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.sendStatus(204);

      await axios.post(
        `http://localhost:3001/workflows/executed/${req.params.id}`
      );
    }
  });
});

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
