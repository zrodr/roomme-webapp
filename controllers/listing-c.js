const axios = require("axios");

const {
  getListing,
  getUserListings,
  newRoom,
  newRoommate,
  alterRoom,
  alterRoommate,
  deleteListing,
} = require("../models/listing");

const { blobToBase64, getPhotoData, generateThumbnail } = require('../helpers/images')
const { processCheckboxes } = require('../helpers/formprocessing')


async function viewRoom(req, res) {
  let id = req.query.id;
  let results = await getListing("Room", id);

  if (results) {
    let amenities = results[0].amenities;
    if (amenities) {
      amenities = amenities
        .split(",")
        .map((a) => a.split(" ").join("_").split("/").join("_")) // making all amentities one word
        .reduce(
          (obj, a) => ({
            ...obj,
            [a]: true,
          }),
          {}
        ); // turning amenities to an array of objects
    }
    let result = { ...results[0], amenities }; // result with amentities array
    let locationCordinatesRes = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        result.address +
        "&key=" + process.env.GOOGLEAPI_KEY
    );
    if (locationCordinatesRes.data.status === "OK") {
      result.mapLink =
        "https://www.google.com/maps/embed/v1/view?key=" + 
        process.env.GOOGLEAPI_KEY + "&center=" +
        locationCordinatesRes.data.results[0].geometry.location.lat +
        "," +
        locationCordinatesRes.data.results[0].geometry.location.lng +
        "&zoom=18&maptype=satellite";
      result.lat = locationCordinatesRes.data.results[0].geometry.location.lat;
      result.lng = locationCordinatesRes.data.results[0].geometry.location.lng;
      // result.coordinates =
      //   locationCordinatesRes.data.results[0].geometry.location;
    }

    let img = null
    if (results[0].room_photos) {
      img = blobToBase64(results[0].room_photos) 
    }

    return res.render("view-room", { listing: result, imgData: img });
  } else {
    return res.render("landing", { msg: "No lisiting found with that id" });
  }
}

async function viewRoommate(req, res) {
  let id = req.query.id;
  let results = await getListing("Roommate", id);

  if (results) {
    let interests = results[0].interests;
    if (interests) interests = interests.split(",");
    let result = { ...results[0], interests }; // result with interests array

    let img = null
    if (results[0].photo) {
      img = blobToBase64(results[0].photo) 
    }
    
    return res.render("view-roommate", { listing: result, imgData: img });
  } else {
    return res.render("landing", { msg: "No lisiting found with that id" });
  }
}

async function viewUserListings(req, res) {
  let id = req.session.userId; // get id from session
  if (!id) 
    return res.render("admin", {});

  let results = await getUserListings("Room", id);
  let results2 = await getUserListings("Roommate", id);

  for (r of results) {
    if (r.room_photos) {
      r.imageData = blobToBase64(await generateThumbnail(r.room_photos)) 
    }
  }

  for (r of results2) {
    if (r.photo) {
      r.imageData = blobToBase64(await generateThumbnail(r.photo)) 
    }
  }

  results = await results.concat(results2);

  if (results.length > 0) {
    return res.render("admin", { listings: results });
  } else {
    return res.render("admin", {
      msg: "No lisitings found. Post a listing in the navigation bar",
      listings: results,
    });
  }
}

// route: POST '/listing/room'
async function createRoom(req, res) {
  const {
    title,
    roomCount,
    occupancy,
    description,
    leasePeriod,
    address,
    priceRange,
  } = req.body;

  const userID = req.session.userId
  const amenities = processCheckboxes(req.body);
  // file uploaded in form: 'data' is the blob to be inserted into DB
  const blob = getPhotoData(req.files)

  try {
    const results = await newRoom(
      roomCount,
      occupancy,
      true,
      amenities,
      blob,
      description,
      leasePeriod,
      userID,
      address, 
      0,
      0,
      title,
      priceRange
    );

    if (results) {
      return res.redirect(`/listing/room/?id=${results.insertId}`);
    } else {
      return res.render("admin", { msg: "Could not create new listing!" });
    }
  } catch (err) {
    res.render("admin", { msg: "Error during listing creation!" });
  }
}

// route: POST '/listing/roommate'
async function createRoommate(req, res, next) {
  const userID = req.session.userId
  const { title, description, duration } = req.body;  
  const interests = processCheckboxes(req.body)
  const blob = getPhotoData(req.files)

  try {
    const results = await newRoommate(description, interests, duration, userID, title, blob);

    if (results) {
      return res.redirect(`/listing/roommate/?id=${results.insertId}`);
    } else {
      return res.render("admin", { msg: "Could not create new listing!" });
    }
  } catch (err) {
    res.render("admin", { msg: "Error during listing creation!" });
  }
}

// route: PUT '/listing/room/(roomid)'
async function editRoom(req, res, next) {
  const listingID = req.params.id;
  const { 
    title, 
    address,
    description,
    roomCount, 
    occupancy,
    leasePeriod,
    priceRange
  } = req.body

  const amenities = processCheckboxes(req.body)
  const blob = getPhotoData(req.files)

  try {
    const results = await alterRoom(roomCount, occupancy, true, amenities, blob, 
      description, leasePeriod, listingID, address, 0, 0, title, priceRange)

    return res.redirect(`/listing/room/?id=${listingID}`);
  }
  catch (err) {
    return res.render('admin', {msg: 'Could not make edits to listing!'})
  }
}

// route: PUT '/listing/roommate/(roommateid)'
async function editRoommate(req, res, next) {
  const listingID = req.params.id;
  const { title, description, duration } = req.body
  const interests = processCheckboxes(req.body)
  const blob = getPhotoData(req.files)

  try {
    const results = await alterRoommate(description, interests, duration, listingID, title, blob)
    return res.redirect(`/listing/roommate/?id=${listingID}`);
  }
  catch (err) {
    return res.render('admin', {msg: 'Could not make edits to listing!'})
  }
}

// route: DELETE '/listing/room/(roomid)'
async function removeRoom(req, res, next) {
  const listingID = req.params.id;

  try {
    results = deleteListing(listingID);
    res.render("admin", { msg: "Listing removed!" });
  } catch (err) {
    res.render("admin", { msg: "Could not remove listing!" });
  }
}

// route: DELETE '/listing/room/(roommateid)'
async function removeRoommate(req, res, next) {
  const listingID = req.params.id;

  try {
    results = deleteListing(listingID, true);
    res.render("admin", { msg: "Listing removed!" });
  } catch (err) {
    res.render("admin", { msg: "Could not remove listing!" });
  }
}

module.exports = {
  viewRoom,
  viewRoommate,
  viewUserListings,
  createRoom,
  createRoommate,
  editRoom,
  editRoommate,
  removeRoom,
  removeRoommate,
};
