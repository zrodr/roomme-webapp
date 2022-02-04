const router = require('express').Router();

const { viewListings } = require('../controllers/search-c')

router.get('/', viewListings);

router.get('/login', (req, res) => {
  res.render('login', {title:"Sign In"});
});

router.get('/register', (req, res) => {
  res.render('register', {title:"Sign Up"});
});

router.get('/view-room', (req, res) => {
  res.render('view-room', {title:"View room"});
});

router.get('/view-roommate', (req, res) => {
  res.render('view-roommate', {title: "View roommate"});
});

router.get('/add-room', (req, res) => {
  res.render('add-room', {title: "Add Room"});
});

router.get('/add-roommate', (req, res) => {
  res.render('add-roommate', {title:"Add Roomate"});
});

router.get('/edit-room/(:id)', (req, res) => {
  res.render('edit-room', {title:"Edit Room",listingID: req.params.id});
});

router.get('/edit-roommate/(:id)', (req, res) => {
  res.render('edit-roommate', {title:"Edit Roommate",listingID: req.params.id});
});

/* For testing/demonstration on the front-end */
/*router.get('/', (req, res) => {
  res.render('error', { test: "Hello World!"})
})*/

module.exports = router;