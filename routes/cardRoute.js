const express = require("express");
const router = express.Router();
const CardController = require('../controllers/cardController')
const {isLogin} = require('../middlewares/auth')
const { uploadAttach } = require('../middlewares/cloudUpload')

router.get('/:listId/card', isLogin, CardController.getAll)
router.post('/:listId/card', isLogin, CardController.createCard)
router.get('/detail/:cardId', isLogin, CardController.getDetail)
router.put('/detail/:cardId', isLogin, CardController.updateCard)
router.get('/detail/:cardId/comment', isLogin, CardController.getComment)
router.post('/detail/:cardId/comment', isLogin, CardController.postComment)
router.get('/detail/:cardId/checklist', isLogin, CardController.getChecklist)
router.post('/detail/:cardId/checklist', isLogin, CardController.addChecklist)
router.post('/:checkId/rename', isLogin, CardController.renameChecklist)
router.post('/:checkId/delete', isLogin, CardController.deleteChecklist)
router.post('/:checkId/check', isLogin, CardController.isCheck)
router.get('/:cardId/attachment', isLogin, CardController.getAttachment)
router.post('/attachment', uploadAttach, CardController.postAttachment)
router.post('/:cardId/priority', isLogin, CardController.postPriority)
router.post('/:cardId/label', isLogin, CardController.postLabel)
router.get('/:cardId/assign', isLogin, CardController.getAssignTo)
router.post('/:cardId/assign', isLogin, CardController.postAssignTo)
router.post('/:cardId/archieve', isLogin, CardController.postArchieved)
router.get('/assign', isLogin, CardController.getUserTask)
router.get('/:listId/card/archieve', isLogin, CardController.getArchieved)

module.exports = router