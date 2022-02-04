const sharp = require('sharp')

sharp.cache(false);

function blobToBase64(imageData) {
  let buffer = Buffer.from(imageData).toString('base64')
  return `data:image/png;base64,${buffer}`
}

function getPhotoData(file) {
  let blob = null;

  if (file) {
    let { data } = file.photo;
    blob = data;
  }

  return blob
}

async function generateThumbnail(photoData) {
  return await sharp(photoData).resize(250).toBuffer() 
}

async function appendThumbnails(searchResults, room=true) {
  if (room) {
    for (res of searchResults) {
      if (res.room_photos) {
        res.imageData = blobToBase64(await generateThumbnail(res.room_photos)) 
      }
    }
  }
  else {
    for (res of searchResults) {
      if (res.photo) {
        res.imageData = blobToBase64(await generateThumbnail(res.photo)) 
      }
    }
  }
}

module.exports = {
  blobToBase64,
  getPhotoData,
  generateThumbnail,
  appendThumbnails
}