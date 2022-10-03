//googleapis
require('dotenv').config();
const { google } = require('googleapis');
//path module
const path = require('path');
//file system module
const fs = require('fs');

const credentials = JSON.parse(atob(process.env.GOOGLE_CREDENTIALS))

//const credentials = require('./credentials2.json');

const scopes = [
    'https://www.googleapis.com/auth/drive',
   // 'https://www.googleapis.com/auth/spreadsheet',
];

const auth = new google.auth.JWT(
    credentials.client_email, null,
    credentials.private_key, scopes
);


const drive = google.drive({ version: 'v3', auth });
const sheets = google.sheets({version: 'v4', auth});

const folderID = '1i_yLlTB6FvQOQZLfVbPzUOw_7SjwWt3h'


//Function to add form data to Google Sheets Doc
function addToSheets(valuesAr) {
    let values = [];
    values.push(valuesAr);
    sheets.spreadsheets.values.append({
        spreadsheetId: '17gXjrveAm0me9cD9FAmZS21QSDW0ccTckcKvENyQsCY',
        valueInputOption: 'USER_ENTERED',
        range: 'A1',
        resource: {
            range: 'A1',
            majorDimension: 'ROWS',
            values: values,
        },
    });
    console.log('Adding Data to Google Sheets')
}

//function to upload the file
async function uploadFile(filePath) {
    try{
        let fileName = path.basename(filePath);
        console.log(`Trying to upload file: ${filePath} (filename: ${fileName})`);
        const response = await drive.files.create({
            requestBody: {
                name:  `${fileName}`, //file name
                mimeType: 'audio/wav',
                parents: [folderID],
                },
            media: {
                mimeType: 'audio/wav',
                body: fs.createReadStream(filePath)
            },
        });
        // report the response from the request
        console.log('response status: ' + response.statusText);
        console.log(response.data);
    }catch (error) {
        //report the error message
        console.log(error.message);

    }
}
module.exports.uploadFile = uploadFile;
module.exports.addToSheets = addToSheets;