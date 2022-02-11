const express = require("express");
const router = express.Router();
const {isLogin} = require("../middlewares/auth")
const {getBoards, getBoardDetail, createList, createBoard, getBoardMembers} = require("../controllers/boardController")

router.get("/:teamId", isLogin, getBoards)
router.get("/board/:boardId", isLogin, getBoardDetail)
router.post("/:boardId/list", isLogin, createList)
router.post("/:teamId", isLogin, createBoard)
router.get("/members/:boardId", isLogin, getBoardMembers)

module.exports = router