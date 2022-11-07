const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "config/dev.env" });
const drive = require('./service');
const stream = require("stream");
const app = express();
const multer = require("multer");
const upload = multer();
const { google } = require("googleapis");
const {GoogleAuth} = require('google-auth-library');
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const auth = new GoogleAuth({
  keyFile: 'fms_certi.json',
  scopes: 'https://www.googleapis.com/auth/drive',
});
const service = google.drive({version: 'v3', auth});

const createFolder = async (folderName)=> {
  console.log(folderName)
  folderId = '1CqOMHH6TgrJ4Y6ZRlfpio4yBe_fDPHZC';
  const fileMetadata = {
    name: folderName,
    parents: [folderId],
    mimeType: 'application/vnd.google-apps.folder',
  };
  try {
    const file = await service.files.create({
      resource: fileMetadata,
      fields: 'id',
    });
    console.log('Folder Id:', file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    console.log(err);
  }
}

const uploadFile = async (fileObject,folderId)=>{
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const fileMetadata = {
    name: fileObject.originalname,
    parents: [folderId],
  };
  const media = {
    mimeType: fileObject.mimeType,
    body: bufferStream,
  };

  try {
    const file = await service.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    console.log('File Id:', file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    console.log(err);
  }

}

app.get("/", (_, res) => {
  res.render("application");
});
app.post("/upload", upload.any(), async function (req, res) {
  try {
    const { body, files } = req;
    console.log(files);
    for (let f = 0; f < files.length; f += 1) {
      console.log("up");
      const folderId = await createFolder('19ESKCS845')
      console.log(folderId)
      await uploadFile(files[f],folderId);
      console.log("down");
    }

    console.log(body);
    res.status(200).send("Form Submitted");
  } catch (f) {
    res.send(f.message);
  }
});

app.listen(3000, () => {
  console.log("Form running on port 3000");
});
