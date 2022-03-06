const Team = require('../models/team')
const errorHandler = require('../utils/error-handler')
const Profile = require('../models/profile')
const Board = require('../models/board')

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
            let findTeam = await Team.findById(req.params.teamId)
            if (!findTeam) {
                res.status(400).send({
                    status: "Not Found",
                    message: 'Data not found!'
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: findTeam
            })
        } catch (error) {
            errorHandler(res, error)
        }
    }
}