
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require('googleapis')
const cors = require("cors");
const { connectedDb } = require('./db');
const crypto = require('crypto')
const Razorpay = require('razorpay');
const { bookRouter } = require('./Routes/book.routes');
const { blogRouter } = require('./Routes/blog.routes');
require("dotenv").config()

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/books", bookRouter)
app.use("/blogs", blogRouter)

const CLIENT_ID = "232436633514-kls6luskokdi4ocg26mst8pmoq8ib3g2.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04-OtHv5AXVBmCgYIARAAGAQSNwF-L9IrEZYv6OiMELSHS4qscPfhnmc7IzRpRH5cMWSJRqb-qH3cYs4lA_52YICaz_UV_AOPNFw"
const RAZORPAY_KEY_ID = "rzp_test_KN15el7AoihdcB"
const RAZORPAY_SECRET = "RiasohQlX2NUYtDvpsTI3V4B"

const oAuth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2client.setCredentials({ refresh_token: REFRESH_TOKEN })

app.post('/process-cod', async (req, res) => {
  try {
    // Extract data from the request body
    const { address, cart, totalAmount } = req.body;

    // Get access token asynchronously using async/await
    const accessToken = await oAuth2client.getAccessToken();

    console.log(address);

    // Create a nodemailer transporter (configure your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'devsh0618@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    // Create email content
    const mailOptions = {
      from: '"Vivechna publication" <devsh0618@gmail.com>',
      to: 'sendevshruti@gmail.com',
      subject: 'Cash on Delivery Order',
      text: `User's Detail: ${address}
      Cart Details: ${JSON.stringify(cart)}
      Total Amount: ${totalAmount}`,
      html: `<h3>User's Detail:</h3>
             <p>name:${address}</p>
             <h3>Cart Details:</h3> 
             <p>${JSON.stringify(cart)}</p>
             <h3>Total Amount:</h3> 
             <h4>${totalAmount}</h4>`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});


app.post('/send-message', async (req, res) => {
  try {
    // Extract data from the request body
    const { name, email, subject, message } = req.body;

    // Get access token asynchronously using async/await
    const accessToken = await oAuth2client.getAccessToken();

    // Create a nodemailer transporter (configure your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'devsh0618@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    // Create email content
    const mailOptions = {
      from: '"Vivechna publication" <devsh0618@gmail.com>',
      to: 'vivechnapublication@gmail.com',
      subject: subject || 'New Message from Contact Form',
      text: `User's Detail: ${name} (${email})
      Message: ${message}`,
      html: `<h3>User's Detail:</h3>
             <p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <h3>Message:</h3>
             <p>${message}</p>`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/order', async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_SECRET,
    })
    const options = req.body;
    const order = await razorpay.orders.create(options);

    console.log("order", order)
    if (!order) {
      return res.status(500).json({ success: false, error: 'Failed to create order' });
    }
    console.log(order)
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create order', details: err.message });
  }
})

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", RAZORPAY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

const port = process.env.PORT
app.listen(port, async () => {
  try {
    await connectedDb;
    console.log("Database connected Successfully");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`server is running on port ${port}`)
})