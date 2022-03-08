const Board = require("../models/board")
const List = require("../models/list")
const User = require("../models/user")
const Profile = require("../models/profile")
const Card = require("../models/card")
const Joi = require("joi");
const errorHandler = require('../utils/error-handler')
const {sendEmail} = require("../utils/mail-sender")

module.exports = {
    getBoards : async (req, res) => {
        const {teamId} = req.params
        try {
            const boards = await Board.find({teamId: teamId})
            if(boards.length == 0) {
                return res.status(404).json({
                    status: 'Not Found',
                    message: `No Boards created`,
                    result : {}
                })
            }
            res.status(200).json({
                status: 'OK',
                message: `Boards with teamId ${teamId}`,
                result : boards
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    createBoard : async (req, res) => {
        const {teamId} = req.params
        const body = req.body
        const user = req.user
        try {
            const schema = Joi.object({
                title : Joi.string().required()
            })
            const {error} = schema.validate(body)
            if (error) {
                return res.status(400).json({
                  status: "Bad Request",
                  message: error.message,
                });
            }
            const creatorProfile = await Profile.findOne({userId: user.id})
            if(!creatorProfile){
                return res.status(404).json({
                    status: "Not Found",
                    message: "Profile not found",
                })
            }
            const member = {
                userId: user.id,
                profileId: creatorProfile._id
            }
            const board = await Board.create({teamId: teamId, title: body.title, members: member})
            if(!board){
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Failed to create board"
                })
            }
            res.status(201).json({
                status: "Created",
                message: "Board created successfully",
                result: board
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getBoardDetail : async (req, res) => {
        const {boardId} = req.params
        try {
            const checkBoard = await Board.findOne({_id: boardId})
            const existUser = checkBoard.members.find((x, i) => req.user.id.toString() == checkBoard.members[i].userId.toString())
            if(!existUser) {
                return res.status(401).json({
                    status: 'Unauthorized',
                    message: 'You are not a member of this board'
                })
            }
            const lists = await List.find({boardId: boardId})
            if(lists.length == 0) {
                return res.status(404).json({
                    status: 'Not Found',
                    message: `No list created`,
                    result : {}
                })
            }
            const result = {
                title: checkBoard.title,
                lists: lists,
            }
            res.status(200).json({
                status: 'OK',
                message: `Get Detail BoardId ${boardId} is Success`,
                result : result
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    createList : async (req, res) => {
        const {boardId} = req.params
        const body = req.body
        try {
            const checkBoard = await Board.findOne({_id: boardId})
            const existUser = checkBoard.members.find((x, i) => req.user.id.toString() == checkBoard.members[i].userId.toString())
            if(!existUser) {
                return res.status(401).json({
                    status: 'Unauthorized',
                    message: 'You are not a member of this board'
                })
            }
            if(!req.body.title){
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Title is required",
                })
            }
            const list = await List.create({boardId: boardId, title: body.title})
            if(!list){
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Failed to create list"
                })
            }
            res.status(201).json({
                status: "Created",
                message: "List created successfully",
                result: list
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    renameList : async (req, res) => {
        const {listId, boardId} = req.params
        try {
            const checkBoard = await Board.findOne({_id: boardId})
            const existUser = checkBoard.members.find((x, i) => req.user.id.toString() == checkBoard.members[i].userId.toString())
            if(!existUser) {
                return res.status(401).json({
                    status: 'Unauthorized',
                    message: 'You are not a member of this board'
                })
            }
            if(!req.body.title){
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Title is required",
                })
            }
            const list = await List.findOne({_id : listId})
            if(!list){
                return res.status(404).json({
                    status: "Not Found",
                    message: "List not found",
                    return: {}
                })
            }
            const update = await List.findOneAndUpdate({_id : listId}, {title: req.body.title}, {new: true})
            if(!update){
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Rename Title is Failed",
                })
            }
            res.status(201).json({
                status: "Created",
                message: "Rename Title is Success",
                result: update
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    archiveList : async (req, res) => {
        const {listId, boardId} = req.params
        let archive
        try {
            const checkBoard = await Board.findOne({_id: boardId})
            const existUser = checkBoard.members.find((x, i) => req.user.id.toString() == checkBoard.members[i].userId.toString())
            if(!existUser) {
                return res.status(401).json({
                    status: 'Unauthorized',
                    message: 'You are not a member of this board'
                })
            }
            const list = await List.findOne({_id: listId})
            if(!list){
                return res.status(404).json({
                    status: "Not Found",
                    message: "No list found"
                })
            }
            if(!list.isArchieved) {
                archive = await List.findOneAndUpdate({_id: list}, {isArchieved : true}, {new: true})
                if(!archive){
                    return res.status(500).json({
                        status: "Internal Server Error",
                        message: "Archive List Failed"
                    })
                }
                return res.status(200).json({
                    status: "OK",
                    message: "Archive Success",
                    result: archive
                })
            }else {
                archive = await List.findOneAndUpdate({_id: list}, {isArchieved : false}, {new: true})
                if(!archive){
                    return res.status(500).json({
                        status: "Internal Server Error",
                        message: "Unarchive List Failed"
                    })
                }
                return res.status(200).json({
                    status: "OK",
                    message: "Unarchive Success",
                    result: archive
                })
            }
        } catch (error) {
            errorHandler(res, error)
        }
    },
    copyList : async (req, res) => {
        const {listId, boardId} = req.params
        var cardResult = []
        try {
            const checkBoard = await Board.findOne({_id: boardId})
            const existUser = checkBoard.members.find((x, i) => req.user.id.toString() == checkBoard.members[i].userId.toString())
            if(!existUser) {
                return res.status(401).json({
                    status: 'Unauthorized',
                    message: 'You are not a member of this board'
                })
            }
            const list = await List.findOne({_id: listId})
            if(!list){
                return res.status(404).json({
                    status: "Not Found",
                    message: "No list found"
                })
            }
            const cards = await Card.find({listId : listId})
            if(!cards){
                return res.status(404).json({
                    status: "Not Found",
                    message: "No cards found"
                })
            }
            const copyList = await List.create({
                boardId : list.boardId,
                title : "[COPY] " + list.title
            })
            if(!copyList){
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Copy List is Failed"
                })
            }
            for(let i in cards){
                var copyCard = await new Card({
                    listId: copyList._id,
                    title: cards[i].title,
                    desc: cards[i].desc,
                    labels: cards[i].labels,
                    attachment: cards[i].attachment,
                    isArchieved: cards[i].isArchieved,
                    assignTo: cards[i].assignTo,
                    comments: cards[i].comments,
                    checklist: cards[i].checklist,
                    priority: cards[i].priority,
                    dueDate: cards[i].dueDate
                }).save()
                if(!copyCard){
                    return res.status(500).json({
                        status: "Internal Server Error",
                        message: "Copy List is Failed"
                    })
                }
                cardResult.push(copyCard)   
            }
            res.status(200).json({
                status : "OK",
                message: "Copy List is Success",
                result: {
                    copyList,
                    cardResult
                }
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getBoardMembers : async (req, res) => {
        const {boardId} = req.params
        try {
            const checkBoard = await Board.findOne({_id: boardId})
            const existUser = checkBoard.members.find((x, i) => req.user.id.toString() == checkBoard.members[i].userId.toString())
            if(!existUser) {
                return res.status(401).json({
                    status: 'Unauthorized',
                    message: 'You are not a member of this board'
                })
            }
            const members = await Board.find({_id: boardId}).select({"members" : 1})
            if(members.length == 0){
                return res.status(404).json({
                    status: "Not Found",
                    message: "No member found"
                })
            }
            console.log(members)
            res.status(200).json({
                status: "OK",
                message: "Board members found",
                result: members
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getOneUser : async (req, res) => {
        const body = req.body
        const {boardId} = req.params
        try {
            const checkBoard = await Board.findOne({_id: boardId})
            const existUser = checkBoard.members.find((x, i) => req.user.id.toString() == checkBoard.members[i].userId.toString())
            if(!existUser) {
                return res.status(401).json({
                    status: 'Unauthorized',
                    message: 'You are not a member of this board'
                })
            }
            const user = await User.findOne({email : body.email}).populate({
                path: "profileId"
            })
            if(!user){
                return res.status(404).json({
                    status: "Not Found",
                    message: "User not found",
                    result: {}
                })
            }
            const userResult = {
                email : user.email,
                name : user.name,
                profileImage : user.profileId.image
            }
            res.status(200).json({
                status: "OK",
                message: "Get User OK",
                result: userResult
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    inviteMembers : async (req, res) => {
        const {boardId} = req.params
        const body = req.body
        var arrMember = []
        try {
            const checkBoard = await Board.findOne({_id: boardId})
            const existUser = checkBoard.members.find((x, i) => req.user.id.toString() == checkBoard.members[i].userId.toString())
            if(!existUser) {
                return res.status(401).json({
                    status: 'Unauthorized',
                    message: 'You are not a member of this board'
                })
            }
            const userLogin = await User.findOne({_id : req.user.id})
            const user = await User.find({email : body.email}).populate({
                path : "profileId",
                select : "image"
            })
            if(user.length == 0) {
                return res.status(404).json({
                    status: "Not Found",
                    message: "User not found",
                    result: {}
                })
            }
            const getBoard = await Board.findOne({_id: boardId})
            for(let i in user){
                for(let j in getBoard.members){
                    if(getBoard.members[j].userId.toString() == user[i]._id.toString()){
                        return res.status(400).json({
                            status: "Bad Request",
                            message: `User ${user[i].name} is already exist in this board`,
                        }) 
                    }
                }
                const member = {
                    userId : user[i]._id,
                    profileId : user[i].profileId
                }
                arrMember.push(member)
                sendEmail(
                    user[i].email, 
                    "Whiteboard Invitation",
                    `
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="https://whiteboardglints.herokuapp.com/" title="logo" target="_blank">
                            <img width="200" src="https://res.cloudinary.com/dry2yqm3h/image/upload/v1646299280/image/whiteboard/whiteboard-logo_xbavgv.png" title="logo" alt="logo">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You are invited by <b>${userLogin.name}</b> to join a <b>${getBoard.title}</b> board</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            Someone is inviting you to join a board. To confirm this invitation, please click the
                                            following link below and follow the instructions.
                                        </p>
                                        <a href="https://whiteboardglints.herokuapp.com/"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Confirm Invitation</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>whiteboardproduct</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>   `
                    )
            }
            const updateMember = await Board.findOneAndUpdate({_id : boardId}, {
                $push: {members : arrMember}
            }, {new: true})
            if(!updateMember){
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Invite members is Failed",
                })
            }
            res.status(201).json({
                status: "OK",
                message: "Invite members is success",
                result: arrMember
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
}