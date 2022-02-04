const router = require('express').Router();

const { viewUserListings } = require('../controllers/listing-c')


// router.get('/', (req, res) => {
//     // we should check if a user is logged in with session
//     // if so, render admin page
//     // else, message must be logged in, redirect to /login or /register
//     res.render('admin', viewUserListings);
// });
    // we should check if a user is logged in with session

router.get('/', viewUserListings);

module.exports = router;