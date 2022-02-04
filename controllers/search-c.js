const { getAll, textSearch, parameterSearch, parameterSearchRoommate } = require('../models/search')
const { blobToBase64, generateThumbnail, appendThumbnails } = require('../helpers/images')

async function param (req, res) {
  let type;
  const params = {
    backyard: req.body.backyard === 'on' ? 'backyard': null,
    furnished: req.body.furnished === 'on' ? 'furnished': null,
    gym: req.body.gym === 'on' ? 'gym': null,
    internet: req.body.internet === 'on' ? 'internet': null,
    laundry: req.body.laundry === 'on' ? 'laundry': null,
    parking: req.body.parking === 'on' ? 'parking': null,
    pool: req.body.pool === 'on' ? 'pool': null,
    bathroom: req.body.bathroom === 'on' ? 'bathroom': null,
    utilities: req.body.utilities === 'on' ? 'utilities': null
  }

  const interests = {
    exercise: req.body.exercise === 'on' ? 'exercise': null,
    partying: req.body.partying === 'on' ? 'partying': null,
    food: req.body.food === 'on' ? 'food': null,
    quiet: req.body.quiet === 'on' ? 'quiet': null,
    gaming: req.body.gaming === 'on' ? 'gaming': null,
    reading: req.body.reading === 'on' ? 'reading': null,
    media: req.body.media === 'on' ? 'media': null,
    sports: req.body.sports === 'on' ? 'sports': null,
  }

  const genders = {
    male: req.body.male,
    female: req.body.female
  }
  
  const lease = {
    min: req.body.minLeasePeriod,
    max: req.body.maxLeasePeriod
  }

  const roomCount = req.body.roomCount;
  const occupancy = req.body.occupancy;

  let minPrice = req.body.minPrice[1];
  let maxPrice = req.body.maxPrice[1];

  let results1 = await parameterSearch(type, params)
  results1 = results1.filter(x => {
    if (x.price_range) {
      if (x.price_range[1] >= minPrice && x.price_range[1] <= maxPrice)
        return x;
    }
  })
  
  let results2 = await parameterSearchRoommate(type, genders, interests);

  await appendThumbnails(results1, true)
  await appendThumbnails(results2, false)

  let results = results1.concat(results2);

  results = results.filter(x => {
    if (lease.min == 0 && lease.max == 100) return x;
    if (x.lease_period) {
      if (x.lease_period >= lease.min && x.lease_period <= lease.max) 
        return x;
    }
  });

  results = results.filter(x => {
    if (roomCount == 0) return x;
    if (x.room_count) {
      if (x.room_count == roomCount) 
        return x;
    }
  });
  
  results = results.filter(x => {
    if (occupancy == 0) return x;
    if (x.occupancy) {
      if (x.occupancy == occupancy) 
        return x;
    }
  });

  if (results.length > 0) {
    return res.render('landing', {searchResults: results})
  }
  else {
    return res.render('landing', {msg: 'No results for your search!', searchResults: results})
  }
}

async function text (req, res) {
    const type = req.body.type;
    const term = req.body.term;
    let results;

    if (!term) {
      if (type == 'All') {
        results = await getAll('Room')
        let results2 = await getAll('Roommate');

        await appendThumbnails(results, true)
        await appendThumbnails(results2, false)

        results = (results.concat(results2));
      } else {
        results = await textSearch(type, term);
      }    
    }
    else {
      // free text form validation
        if (!term.match(/^[0-9a-z]+$/)) {
          return res.render('landing', {msg: 'Invalid Search: Must contain only letters and numbers'})
        }
        if (term.length > 40) {
          return res.render('landing', {msg: 'Invalid Search: Cannot not be over 40 characters'})
        }
        if (type == 'All') {
          results = await textSearch('Room', term);
          let results2 = await textSearch('Roommate', term);

          await appendThumbnails(results, true)
          await appendThumbnails(results2, false)

          results = (results.concat(results2));
        } else {
          results = await textSearch(type, term);
        }
    }

    if (results.length>0) {
      return res.render('landing', {searchResults: results})
    }
    else {
      return res.render('landing', {msg: 'No results for that search', searchResults: results})
    }
}

async function viewListings (req, res) {
  let results = await getAll('Room')
  let results2 = await getAll('Roommate');

  await appendThumbnails(results, true)
  await appendThumbnails(results2, false)

  results = (results.concat(results2));
  
  if (results.length>0) {
    return res.render('landing', {title:"Home",searchResults: results})
  }
  else {
    return res.render('landing', {title:"Home",msg: 'No results for that search', searchResults: results})
  }
}

module.exports = {
  text,
  param,
  viewListings
}