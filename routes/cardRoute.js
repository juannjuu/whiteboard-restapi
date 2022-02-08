const express = require("express");
const router = express.Router();
const CardController = require('../controllers/cardController')

router.get('/:listId/card', CardController.getAll)
router.post('/:listId/card', CardController.createCard)
router.get('/detail/:cardId', CardController.getDetail)
router.put('/detail/:cardId', CardController.updateCard)
router.get('/detail/:cardId/comment', CardController.getComment)
router.post('/detail/:cardId/comment', CardController.postComment)
router.get('/detail/:cardId/checklist', CardController.getChecklist)
router.post('/detail/:cardId/checklist', CardController.addChecklist)
router.post('/:checkId/rename', CardController.renameChecklist)
router.post('/:checkId/delete', CardController.deleteChecklist)
router.post('/:checkId/check', CardController.isCheck)
router.post('/:checkId/uncheck', CardController.isUnCheck)
router.get('/:cardId/attachment', CardController.getAttachment)
router.post('/:cardId/priority', CardController.postPriority)
router.post('/:cardId/label', CardController.postLabel)
router.get('/:cardId/assign', CardController.getAssignTo)
router.post('/:cardId/assign', CardController.postAssignTo)
router.post('/:cardId/archieve', CardController.postArchieved)
router.get('/assign/:userId', CardController.getUserTask)
router.get('/:listId/card/archieve', CardController.getArchieved)

module.exports = router