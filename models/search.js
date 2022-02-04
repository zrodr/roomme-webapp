const db = require('../database/db')

async function getAll(type) {
  const sql = `SELECT * FROM ${type}Listing`;
  try {
    [results, fields] = await db.query(sql)
  }
  catch(err) {
    return undefined
  }
  
  return results;
}

async function textSearch(type, searchTerm) {
/*
* param: free text search parameter
*/
const sql = 
`
SELECT * FROM ${type}Listing a 
WHERE a.description LIKE ?
OR a.title LIKE ?;
`;
try {
  [results, fields] = await db.query(sql, ['%'+searchTerm+'%', '%'+searchTerm+'%'])
}
catch(err) {
  return undefined
}

return results;
}

/*
* param: preferences object
*/
async function parameterSearch(type, parameters) {
  let = amenString = '';
  for (key in parameters) {
    if (parameters[key]) {
      if (amenString === '')
        amenString += `WHERE a.amenities LIKE '%${parameters[key]}%'`;
      else 
        amenString += ` AND a.amenities LIKE '%${parameters[key]}%'`
    }
  }
  const sql = 
  `
  SELECT * FROM RoomListing a ${amenString};
  `

  try {
    [results, fields] = await db.query(sql)
  }
  catch (err) {
    return undefined
  }

  return results;
}

async function parameterSearchRoommate(type, genders, parameters) {
  let sql;
  if (genders.male && genders.female )
    sql = `SELECT * FROM RoommateListing rl`
  else if (genders.male)
    sql = 
    `SELECT rl.*, u.name, u.phone_number, u.email, u.gender
    FROM RoommateListing rl LEFT JOIN User u ON rl.userID = u.id
    WHERE u.gender = "male"
    `;
  else if (genders.female)
    sql = 
    `SELECT rl.*, u.name, u.phone_number, u.email, u.gender
    FROM RoommateListing rl LEFT JOIN User u ON rl.userID = u.id
    WHERE u.gender = "female"
    `;
  else
    sql = `SELECT * FROM RoommateListing rl`;

  let = amenString = '';
  for (key in parameters) {
    if (parameters[key]) {
      if (amenString === '' && sql === 'SELECT * FROM RoommateListing rl')
        amenString += ` WHERE rl.interests LIKE '%${parameters[key]}%'`;
      else 
        amenString += ` AND rl.interests LIKE '%${parameters[key]}%'`
    }
  }


  try {
    sql += amenString;
    [results, fields] = await db.query(sql)
  }
  catch (err) {
    return undefined
  }
  return results;
}

module.exports = {
  getAll,
  textSearch,
  parameterSearch,
  parameterSearchRoommate
}