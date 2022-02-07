const express = require("express");
const router = express.Router();
const CardController = require('../controllers/cardController')

router.get('/:listId/card', CardController.getAll)
router.post('/:listId/card', CardController.createCard)
router.get('/detail/:cardId', CardController.getDetail)
router.put('/detail/:cardId', CardController.updateCard)
router.get('/detail/:cardId/comment', CardController.getComment)
router.post('/detail/:cardId/comment', CardController.postComment)
router.post('/:cardId/priority', CardController.postPriority)
router.post('/:cardId/label', CardController.postLabel)
router.post('/:cardId/assign', CardController.postAssignTo)
router.post('/:cardId/archieve', CardController.postArchieved)
router.get('/assign/:userId', CardController.getUserTask)
router.get('/:listId/card/archieve', CardController.getArchieved)

module.exports = router