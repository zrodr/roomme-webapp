const router = require('express').Router()
const { renderAbout } = require('../controllers/about-c')
/* 
 * For after M0, when the about page is no longer our landing page
*/
/*router.get('/', (req, res) => {

});*/

router.get('/', (req, res) => {
    res.render('about', {title: "About"});
});

router.get('/nael-yun', renderAbout);
router.get('/vy-ngo', renderAbout);
router.get('/tanishq-pradhan', renderAbout);
router.get('/jay-jaber', renderAbout);
router.get('/kaung-htun', renderAbout);
router.get('/vandit-malik', renderAbout);
router.get('/izaiah-rodriguez', renderAbout);

module.exports = router;