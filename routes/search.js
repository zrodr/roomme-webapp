const router = require('express').Router();
const { text, param, viewListings } = require('../controllers/search-c')


router.post('/text', text);
router.post('/param', param);

router.get('*', viewListings);

// need the following routes: 
// POST /text-search -> will call getAll() if search term is '' or textSearch() otherwise
// POST /param-search -> will call parameterSearch()
module.exports = router;