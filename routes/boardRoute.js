const express = require("express");
const router = express.Router();
const {isLogin} = require("../middlewares/auth")
const BoardController = require("../controllers/boardController")

router.get("/:teamId", isLogin, BoardController.getBoards)
router.post("/:teamId", isLogin, BoardController.createBoard)

router.get("/members/:boardId", isLogin, BoardController.getBoardMembers)
router.get("/members/:boardId/member", isLogin, BoardController.getOneUser)
router.put("/members/:boardId/member", isLogin, BoardController.inviteMembers)

router.get("/detail/:boardId", isLogin, BoardController.getBoardDetail)

router.post("/:boardId/list", isLogin, BoardController.createList)
router.put("/:listId/archive", isLogin, BoardController.archiveList)
router.post("/:listId/copy", isLogin, BoardController.copyList)

module.exports = router