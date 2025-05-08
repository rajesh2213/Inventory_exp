const { Router } = require('express');
const router = Router({ mergeParams: true });
const gameCtrl = require('../controllers/gameController.js');

//router.get('/', gameCtrl.game_list);
router.get('/by-genre', gameCtrl.game_list_by_genre);

router.get('/create', gameCtrl.game_create_get);
router.post('/create', gameCtrl.game_create_post);

module.exports = router;