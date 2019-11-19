const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: './client/public/assets',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ 
    storage: storage,
    dest: './client/public/assets',
    limits: { fileSize: 1000000 }, 
    fileFilter: function (req, file, cb){
        checkFileType(file, cb);
    }
})
const vision = require('@google-cloud/vision');
const app = express();
const port = process.env.NODE_ENV || 5000;

app.set('views', __dirname + '/client');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());
// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFileName: '../Downloads/high-form-259413-d5b25e3ed4c4.json'
});

function checkFileType(file, cb){
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extname){
        if (cb){
            cb(null,true);
        }
        return "Success"
    } else {
        if (cb){
            cb('Error: Images only');
        }
        return "Error: Images Only!"
    }
}

app.use(function(req, res, next) {
    if (req.headers['content-type'] === 'application/json;') {
      req.headers['content-type'] = 'application/json';
    }
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/upload', upload.single("theImage"), async (req,res)=>{
    res.setHeader ('Access-Control-Allow-Origin', '*')
    const [result] = await client.labelDetection(req.file.path);
    const labels = result.labelAnnotations;
    const description = [...new Set(labels.map(val => val.description))]
    res.status(200).send({ 
        status: "success", 
        message: `assets/${req.file.filename}`,
        description: description
    })
})

app.post('/search', (req, res)=>{
    res.setHeader ('Access-Control-Allow-Origin', '*')
    console.log(req.body)
    /*const query = req.body.q
    const SEARCH_URL = `https://serpapi.com/playground?q=${query}&tbm=isch&ijn=0`;
    fetch(SEARCH_URL, {
        method: 'GET',
    })
    .then(res=>res.json())
    .then(response=>{
        console.log(response);
    })
    .catch(err=>console.log(err))*/
})

app.listen(port, '127.0.0.1', ()=>{
    console.log('SERVER_RUNNING')
})