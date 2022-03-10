const Team = require('../models/team')
const errorHandler = require('../utils/error-handler')
const Profile = require('../models/profile')
const Board = require('../models/board')
const mongoose = require('mongoose')

module.exports = {
    getTeam : async(req, res) => {
        try {
            let user = req.user
            const findTeam = await Team.find({
                members: {
                    $elemMatch: {
                        userId: user.id
                    }
                }
            })
            res.status(200).send({
                status: "OK",
                message: 'Team is found',
                result: findTeam
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    createTeam : async(req, res) => {
        try {
            let user = req.user
            let members = {
                userId: user.id
            }
            let teamNew = new Team({
                teamName: req.body.teamName,
                members: members
            })
            await teamNew.save(teamNew)
            res.status(201).send({
                status: "Created",
                message: 'Created Successfully',
                result: teamNew
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getDetailTeam: async(req, res) => {
        try {
            let user = req.user

            let getTeam = await Board.aggregate([
                {
                    $match: {
                        // "teamId": mongoose.Types.ObjectId(idTeam),
                        'members.userId': user.id,
                    }
                },
                {
                    $lookup: {
                        localField: 'teamId',
                        from: 'teams',
                        foreignField: '_id',
                        as: 'teams'
                    }
                },
                {
                    $unwind: {
                        path: '$teams',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'title': 1,
                        'teams._id': 1,
                        'teams.teamName': 1,
                    }
                }
            ])

            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: getTeam
            })
        } catch (error) {
            errorHandler(res, error)
        }
    }
}