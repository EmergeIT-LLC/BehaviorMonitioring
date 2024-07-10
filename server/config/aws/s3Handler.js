require('dotenv').config(); // Load environment variables from .env file
const AWS = require('aws-sdk');
const fs = require('fs');
const cron = require('node-cron');
const sqlite3 = require('sqlite3').verbose();
const emailHandler = require('../email/emailTemplate');
const AWSbackupFileName = 'dataStorage.db'; // Backup file name
const AWSDBFilePath = `./config/database/${AWSbackupFileName}`;
const AWSBackupKey = `behaviorMonitoring/${AWSbackupFileName}`;
const jsonHandler = require('../../functions/jsonHandler');
const prodStatus = process.env.IN_PROD;

// Configure AWS credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create S3 instance
const s3 = new AWS.S3();

// Function to backup SQLite database file to S3
function backupDatabaseToS3() {
  const dbFilePath = AWSDBFilePath;
  const backupKey = AWSBackupKey;

  // Check if the backup file already exists in S3
  s3.headObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey }, (err, metadata) => {
    if (!err) {
      //Backup file already exists. Overriding...
      // If the backup file exists, delete it before uploading the new one
      s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey }, (err, data) => {
        if (err) {
          //Error deleting existing backup file
        } else {
          //Existing backup file deleted.
        }
        uploadBackup();
      });
    } else {
      if (err.code !== 'NotFound') {
        //Error checking if backup file exists
      }
      // If the backup file doesn't exist or error occurred, upload the new one directly
      uploadBackup();
    }
  });

  // Function to upload the backup file to S3
  function uploadBackup() {
    emailHandler.sendDatabaseBackupNotification();
    const fileContent = fs.readFileSync(dbFilePath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: backupKey,
      Body: fileContent
    };
    s3.upload(params, (err, data) => {
      if (err) {
        //error uploading backup
        updateBackupImportStatus("backup", "Unsccessful");
        sendDatabaseBackupImportEmailNotification("backup", "Unsuccessful", err.message);
      } else {
        //Backup uploaded successfully
        //data.Location
        updateBackupImportStatus("backup", "Successful");
        sendDatabaseBackupImportEmailNotification("backup", "Successful", "");
      }
    });
  }
}

// Function to import backup from S3
function importBackupFromS3() {
  emailHandler.sendDatabaseImportNotification();
  const dbFilePath = AWSDBFilePath;
  const backupKey = AWSBackupKey;

  // Check if the backup file exists in S3
  s3.headObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey }, (err, metadata) => {
    if (err) {
      //Error checking if backup file exists
      updateBackupImportStatus("import", "Unsuccessful");
      sendDatabaseBackupImportEmailNotification("import", "Unsuccessful", err.message);
      return;
    }

    // If the backup file exists, download it
    const fileStream = fs.createWriteStream(dbFilePath);
    s3.getObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey })
      .createReadStream()
      .pipe(fileStream);

    fileStream.on('error', (err) => {
      //Error downloading backup file
      updateBackupImportStatus("import", "Unsuccessful");
      sendDatabaseBackupImportEmailNotification("import", "Unsuccessful", err.message);
    });

    fileStream.on('finish', () => {
      //Backup file downloaded successfully
      updateBackupImportStatus("import", "Successful");
      sendDatabaseBackupImportEmailNotification("import", "Successful", "");
    });
  });
}

// Function to send email notification
function sendDatabaseBackupImportEmailNotification(backupOrImport, status, logs) {
  if (prodStatus === "true") {
    if (backupOrImport === "backup") {
      emailHandler.sendDatabaseBackupResultsNotification(status, logs);
    }
    if (backupOrImport === "import") {
      emailHandler.sendDatabaseImportResultsNotification(status, logs);
    }
  }
}

function updateBackupImportStatus(backupOrImport, successOrUnsuccess) {
  if (prodStatus === "true") {
    if (backupOrImport === "backup") {
      jsonHandler.updateBackupDetails(successOrUnsuccess);
    }
    if (backupOrImport === "import") {
      jsonHandler.updateImportDetails(successOrUnsuccess);
    }
  }
}

// Schedule backup to run every day at 12:00 AM EST
cron.schedule('5 0 * * *', () => {
  backupDatabaseToS3();
}, {
  timezone: "America/New_York"
});

module.exports = {
  backupDatabaseToS3,
  importBackupFromS3
};