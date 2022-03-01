const express = require("express");
const router = express.Router();
const {isLogin} = require("../middlewares/auth")
const {getBoards, getBoardDetail, createList, createBoard, getBoardMembers, archiveList, getOneUser, inviteMembers, copyList} = require("../controllers/boardController")

router.get("/:teamId", isLogin, getBoards)
router.get("/board/:boardId", isLogin, getBoardDetail)
router.post("/:boardId/list", isLogin, createList)
router.post("/:teamId", isLogin, createBoard)
router.get("/members/:boardId", isLogin, getBoardMembers)
router.put("/:listId/archive", isLogin, archiveList)
router.get("/members/:boardId/member", isLogin, getOneUser)
router.put("/members/:boardId/member", isLogin, inviteMembers)
router.post("/:listId/copy", isLogin, copyList)

module.exports = router