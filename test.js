require("dotenv").config({ path: "config/dev.env" });
const stream = require("stream");
const multer = require("multer");
const upload = multer();
const { google } = require("googleapis");
const {GoogleAuth} = require('google-auth-library');

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

module.exports = {createFolder,uploadFile};
