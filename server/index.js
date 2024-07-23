require('dotenv').config();
const AWS_S3_Bucket_Handler = require('./config/aws/s3Handler');
const jsonHandler = require('./functions/basic/jsonHandler');
const host = process.env.HOST;
const port = process.env.PORT;
const prodStatus = process.env.IN_PROD;
const clientOrigin = process.env.ClientHost;
const amplifyOrigin = process.env.AmplifyHost;
const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
let prodHost = process.env.HOST + ":" + process.env.PORT;

// Define allowed origins
const allowedOrigins = [clientOrigin, amplifyOrigin];

// CORS configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'X-Requested-With', 'Custom-Header'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

if (prodStatus === "true") {
  prodHost = host;
  jsonHandler.testJson();
  AWS_S3_Bucket_Handler.importBackupFromS3();
}

// Middleware for setting CORS headers for routes that exist and are from allowed origin
const setHeadersForAllowedRoutes = (req, res, next) => {
  // Check if the request origin is allowed
  if (allowedOrigins.includes(req.headers.origin)) {
    // Set CORS headers for the allowed origin
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  next();
};

// Define your routes before the middleware for handling 404 errors
app.get('/', (req, res) => {
  if (prodStatus === "true") {
    res.send("The server is running successfully. <br/>The server url is " + prodHost + "...");
  }
  else {
    res.send("The server is running successfully. <br/>The server is running on port " + port + "... <br/>The server url is " + prodHost + "...");
  }
});

const adminRoute = require('./routes/Admin');
app.use('/admin', setHeadersForAllowedRoutes, adminRoute);

const employeeRoute = require('./routes/Employee');
app.use('/employee', setHeadersForAllowedRoutes, employeeRoute);

const abaRoute = require('./routes/ABA');
app.use('/aba', setHeadersForAllowedRoutes, abaRoute);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Middleware for handling errors and setting CORS headers
app.use((err, req, res, next) => {
  // Set CORS headers to allow requests from the allowed origins
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.join(', '));
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Check if it's a 404 error
  if (err.status && err.status === 404) {
    res.redirect(host + '/PageNotFound');
  } else if (err.status) {
    // For other errors with status codes, send corresponding error response
    res.status(err.status).send(err.message || 'Internal Server Error');
  }
});

app.listen(port, () => {
  console.log("Server running on port " + port + "...");
});