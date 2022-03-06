const express = require("express");
const router = express.Router();
const CardController = require('../controllers/cardController')
const {isLogin} = require('../middlewares/auth')
const { uploadAttach } = require('../middlewares/cloudUpload')

router.get('/:listId', isLogin, CardController.getAll)
router.post('/:listId', isLogin, CardController.createCard)
router.get('/detail/:cardId', isLogin, CardController.getDetail)
router.post('/detail/:cardId', isLogin, CardController.updateCard)
router.post('/copyall/:listId/:listDest', isLogin, CardController.copyAllCard)
router.post('/copyone/:cardId/:listDest', isLogin, CardController.copyOneCard)

router.get('/comment/:cardId', isLogin, CardController.getComment)
router.post('/comment/:cardId', isLogin, CardController.postComment)

router.get('/checklist/a/:cardId', isLogin, CardController.getChecklist)
router.post('/checklist/n/:cardId', isLogin, CardController.addChecklist)
router.post('/checklist/r/:checkId', isLogin, CardController.renameChecklist)
router.post('/checklist/d/:checkId', isLogin, CardController.deleteChecklist)
router.post('/checklist/c/:checkId', isLogin, CardController.isCheck)

router.get('/attachment/a/:cardId', isLogin, CardController.getAttachment)
router.post('/attachment/n/:cardId', isLogin, uploadAttach("attachment"), CardController.postAttachment)
router.post('/attachment/r/:attachmentId', isLogin, CardController.renameAttachment)
router.post('/attachment/d/:attachmentId', isLogin, CardController.deleteAttachment)

router.post('/priority/:cardId', isLogin, CardController.postPriority)
router.post('/label/:cardId', isLogin, CardController.postLabel)
router.get('/assign/:cardId', isLogin, CardController.getAssignTo)
router.post('/assign/:cardId', isLogin, CardController.postAssignTo)

router.post('/archieve/:cardId', isLogin, CardController.postArchieved)
router.post('/archieveall/:listId', isLogin, CardController.allCardArchive)
router.get('/userassign/task', isLogin, CardController.getUserTask)
router.get('/archieve/:listId', isLogin, CardController.getArchieved)

router.get('/userassign/done/:boardId', isLogin, CardController.getCountUserDoneTask)
router.get('/userassign/all/:boardId', isLogin, CardController.getCountAllUserTask)

module.exports = router