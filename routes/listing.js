const router = require('express').Router();

const { 
  createRoom, createRoommate, 
  viewRoom, viewRoommate,
  editRoom, editRoommate,
  removeRoom, removeRoommate 
} = require('../controllers/listing-c')

router.get('/room', viewRoom);
router.get('/roommate', viewRoommate);


// edit listing
router.put('/room/(:id)', editRoom)
router.put('/roommate/(:id)', editRoommate)

// delete listing
router.delete('/room/(:id)', removeRoom)
router.delete('/roommate/(:id)', removeRoommate)

// routes to create new listings and store them in db
router.post('/room', createRoom)
router.post('/roommate', createRoommate)

module.exports = router;