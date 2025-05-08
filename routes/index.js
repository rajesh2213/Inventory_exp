const { Router } = require('express');
const ctrl = require('../controllers/indexController.js');

const router = Router();

router.get('/', ctrl.index)

module.exports = router;