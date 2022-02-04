const db = require('../database/db')
const {load} = require("nodemon/lib/rules");

async function getListing(type, id) {
  const sql = `SELECT rl.*, u.name, u.phone_number, u.email, u.gender
  FROM ${type}Listing rl LEFT JOIN User u ON rl.userID = u.id
  WHERE rl.id = ?;
  `;
  try {
    [results, fields] = await db.query(sql, [id]);
  }
  catch(err) {
    return undefined
  }
  
  return results;
}

async function getUserListings(type, id) {
  const sql = `SELECT rl.*, u.name, u.phone_number, u.email, u.gender
  FROM ${type}Listing rl LEFT JOIN User u ON rl.userID = u.id
  WHERE u.id = ?;
  `;
  try {
    [results, fields] = await db.query(sql, [id]);
  }
  catch(err) {
    return undefined
  }
  return results;
}

async function newRoom(roomCount, occupancy, vacant, amenities, photo, 
    description, leasePeriod, userID, address, lat, long, title, priceRange) {
  const sql = 
  `
  INSERT INTO RoomListing 
  (room_count, occupancy, vacant, amenities, room_photos, description, 
    lease_period, userID, address, latitude, longitude, title, price_range)
  VALUES (
    ?,?,?,(?),?,?,?,?,?,?,?,?,?
  )
  `

  try {
    [results, fields] = await db.query(sql, [roomCount, occupancy, vacant, amenities, photo,
      description, leasePeriod, userID, address, lat, long, title, priceRange])
    return results 
  }
  catch (err) {
    throw new Error(err)
  }
}


async function newRoommate(description, interests, duration, userID, title, blob) {
  const sql = 
  `
  INSERT INTO RoommateListing 
  (description, interests, duration, userID, title, photo)
  VALUES (
    ?,?,?,?,?,?
  )
  `
  try {
    [results, fields] = await db.query(sql, [description, interests, duration, userID, title, blob])
    return results 
  }
  catch (err) {
    throw new Error(err)
  }
}


async function alterRoom(roomCount, occupancy, vacant, amenities, photo, 
  description, leasePeriod, userID, address, lat, long, title, priceRange) {
    const sql = 
    `
    UPDATE RoomListing SET
    room_count = ?,
    occupancy = ?, 
    vacant = ?,
    amenities = (?),
    room_photos = ?,
    description = ?,
    lease_period = ?,
    address = ?,
    latitude = ?,
    longitude = ?,
    title = ?,
    price_range = ?
    
    WHERE id = ?
    `
  
    try {
      [results, fields] = await db.query(sql, [roomCount, occupancy, vacant, amenities, photo,
        description, leasePeriod, address, lat, long, title, priceRange, userID])
      return results 
    }
    catch (err) {
      throw new Error(err)
    }
}

async function alterRoommate(description, interests, duration, listingID, title, photo) {
  const sql = 
  `
  UPDATE RoommateListing SET

  description = ?,
  interests = ?,
  duration = ?,
  title = ?,
  photo = ?

  WHERE id = ?
  `
  try {
    [results, fields] = await db.query(sql, [description, interests, duration, title, photo, listingID])
    return results 
  }
  catch (err) {
    throw new Error(err)
  }
}

async function deleteListing(listingID, roommate) {
  let table

  if (roommate) {
    table = 'RoommateListing'
  }
  else {
    table = 'RoomListing'
  }

  const sql =  
  `
  DELETE FROM ${table} WHERE id = ?
  `

  try {
    [results, fields] = await db.query(sql, [listingID])
    return results 
  }
  catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  getListing,
  getUserListings,
  newRoom, 
  newRoommate,
  alterRoom, 
  alterRoommate,
  deleteListing
}