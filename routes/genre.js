const { Router } = require('express');
const router = Router();
const genreCtrl = require('../controllers/genreController.js');
const gameRouter = require('./game.js');

router.get('/create', genreCtrl.genre_create_get);
router.post('/create', genreCtrl.genre_create_post);

router.get('/:genreId/edit', genreCtrl.genre_edit_get);
router.post('/:genreId/edit', genreCtrl.genre_edit_post);

router.get('/:genreId/game', (req, res, next) => {
    req.url = '/by-genre';
    gameRouter(req, res, next);
});

// Other nested game routes
router.use('/:genreId/game', gameRouter);

module.exports = router;