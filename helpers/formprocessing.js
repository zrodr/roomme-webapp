// helper function: turns activated checkboxes in req.body into SQL format
function processCheckboxes(body) {
  let amenities = "";
  for (const key in body) {
    if (body[key] === 'on') {
      if (key === 'parking') amenities += `garage/parking,`
      else if (key === 'bathroom') amenities += `private bathroom,`
      else if (key === 'utilities') amenities += `utilities included,`
      else {
        amenities += `${key},`;
      }
    }
  }
  return amenities.slice(0, -1);
}

module.exports = {
  processCheckboxes
}