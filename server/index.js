require('dotenv').config();
const AWS_S3_Bucket_Handler = require('./middleware/aws/s3Handler');
const jsonHandler = require('./functions/base/jsonHandler');
const host = process.env.HOST;
const port = process.env.PORT;
const prodStatus = process.env.IN_PROD === "true";
const clientOrigin = process.env.ClientHost;
const amplifyOrigin = process.env.AmplifyHost;
const cors = require('cors');
const express = require('express');
const app = express();
const authMiddleware = require('./middleware/authMiddleware');
const requestLogger = require('./middleware/requestLogger');
let prodHost = prodStatus ? `${process.env.HOST}` : `${process.env.HOST}${process.env.PORT ? `:${process.env.PORT}` : ''}`;

// Define allowed origins
const allowedOrigins = [clientOrigin, amplifyOrigin].filter(Boolean);

// CORS configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'X-Requested-With', 'Custom-Header', 'X-Requested-With', 'Origin'],
};

app.use(requestLogger);
app.use(cors(corsOptions));
app.use(express.json());

if (prodStatus) {
  prodHost = host;
  jsonHandler.testJson();
  AWS_S3_Bucket_Handler.importBackupFromS3();
}

// Define your routes before the middleware for handling 404 errors
app.get('/', (req, res) => {
  if (prodStatus === "true") {
    res.send("The server is running successfully. <br/>The server url is " + prodHost + "...");
  }
  else {
    res.send("The server is running successfully. <br/>The server is running on port " + port + "... <br/>The server url is " + prodHost + "...");
  }
});

const authRoute = require('./routes/Auth');
app.use('/auth', authRoute);

const adminRoute = require('./routes/Admin');
app.use('/admin', authMiddleware, adminRoute);

const employeeRoute = require('./routes/Employee');
app.use('/employee', authMiddleware, employeeRoute);

const abaRoute = require('./routes/ABA');
app.use('/aba', authMiddleware, abaRoute);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Middleware for handling errors and setting CORS headers
app.use((err, req, res, next) => {
  if (err.status && err.status === 404) {
    res.redirect(host + '/PageNotFound');
  } 
  
  if (err.status) {
    res.status(err.status).send(err.message || 'Internal Server Error');
  }

  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log("Server running on port " + port + "...");
});