const Board = require("../models/board")
const List = require("../models/list")
const User = require("../models/user")
const Profile = require("../models/profile")
const Card = require("../models/card")
const Joi = require("joi");
const errorHandler = require('../utils/error-handler')

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
    getBoardDetail : async (req, res) => {
        const {boardId} = req.params
        try {
            const lists = await List.find({boardId: boardId})
            if(lists.length == 0) {
                return res.status(404).json({
                    status: 'Not Found',
                    message: `No list created`,
                    result : {}
                })
            }
            res.status(200).json({
                status: 'OK',
                message: `List with boardId ${boardId}`,
                result : lists
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    createList : async (req, res) => {
        const {boardId} = req.params
        const body = req.body
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
    getBoardMembers : async (req, res) => {
        const {boardId} = req.params
        try {
            const members = await Board.find({_id: boardId}).select({"members" : 1})
            if(members.length == 0){
                return res.status(404).json({
                    status: "Not Found",
                    message: "No member found"
                })
            }
            res.status(200).json({
                status: "OK",
                message: "Board members found",
                result: members
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    archiveList : async (req, res) => {
        const {listId} = req.params
        let archive
        try {
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
    getOneUser : async (req, res) => {
        const body = req.body
        try {
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
            // const profile = await Profile.findOne({userId : user._id})
            // if(!profile){
            //     return res.status(404).json({
            //         status: "Not Found",
            //         message: "Profile is Not Found",
            //     })
            // }
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
    copyList : async (req, res) => {
        const {listId} = req.params
        var cardResult = []
        try {
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
    }
}