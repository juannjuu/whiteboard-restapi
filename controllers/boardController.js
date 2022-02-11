const Board = require("../models/board")
const List = require("../models/list")
const User = require("../models/user")
const Profile = require("../models/profile")
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
            if(!lists) {
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
            if(!members){
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

    }
}