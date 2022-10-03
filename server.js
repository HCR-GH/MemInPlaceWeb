const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const multer = require('multer');
const path = require("path");
const isWebm = require('is-webm');
const { body } = require('express-validator')

const drive = require("./drive.js")

const port = process.env.PORT || 8000;

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename(req, file, cb) {
        const filename = `${Date.now()}.wav`;
        console.log(`Multer using file: ${filename}`)
        cb(null, filename);
    },
});
const upload = multer({storage: storage,
    fileFilter: function(req, file, callback) {
        console.log("in file Filter");
        let ext = path.extname(file.originalname)
        if (ext !== '.wav') {
            return callback(res.end('Must be a wav file'), null)
        }
        callback(null, true)
    }
});


// hbs.registerHelper('getCurrentYear', () => {
//   return new Date().getFullYear()
// });
//
// hbs.registerHelper('screamIt', (text) => {
//     return text.toUpperCase();
// });


app.use((req, res, next) => {

    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log)
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log')
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

app.use(express.static('uploads'));


app.post('/record', upload.single('userAudio'),
    body('dispName').trim().escape(),
    body('name').trim().escape(),
    body('email').trim().escape(),
    body('contact').trim().escape(),
    body('from').trim().escape(),
    async (req, res) => {
    let formDataArray = []
    formDataArray.push(req.body.dispName);
    formDataArray.push(req.body.name);
    formDataArray.push(req.body.email);
    formDataArray.push(req.body.contact);
    formDataArray.push(req.body.from);
    formDataArray.push(req.file.filename)
   const file = req.file.path;
   const fileName = req.file.filename;
    let buffer = fs.readFileSync(file);
    let formatCheck = (isWebm(buffer));
   // let valAr = ['h', '2', 'p'];
    if (formatCheck) {
        const fileForUpload = file// From multer
        console.log(`file name: ${fileName}`);
        console.log(`Uploading: ${fileForUpload}`)
        try {
            await drive.uploadFile(fileForUpload);
            drive.addToSheets(formDataArray);
            console.log(`Uploading completed`)
            res.json({success: true});
        } catch {
            console.log(`Uploading error`)
            res.json({ success: false });
        } finally {
            console.log(`Removing temp file`)
            fs.unlinkSync(fileForUpload);
    }} else {
        console.log(`Deleting invalid file type`)
        fs.unlinkSync(file);
        res.json({success: false});
    }
});



app.get('/', (req,res) => {
    //res.send('<h1>Hello Express</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Hi There',
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/bad', (req, res) => {
    res.send({
       errorMessage: 'Unable to handle request'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects',
    });
});

/*
app.get('/recordings', (req, res) => {
    console.log("app.get called");
    let files = fs.readdirSync(path.join(__dirname, 'uploads'));
    console.log(files);
    let fileForUpload = files[files.length - 1];
    console.log(fileForUpload);
    drive.uploadFile(fileForUpload);
});
*/
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});