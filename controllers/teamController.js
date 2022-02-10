const Team = require('../models/team')
const errorHandler = require('../utils/error-handler')
const Profile = require('../models/profile')

module.exports = {
    getTeam : async(req, res) => {
        try {
            // let userId = req.user
            const findTeam = await Team.find({
                members: {
                    $elemMatch: {
                        userId: req.params.userId
                        // userId: userId.id
                    }
                }
            })

            res.status(201).send({
                status: 201,
                message: 'Team Index',
                result: findTeam
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },

    createTeam : async(req, res) => {
        try {
            // let user = req.user
            let body = req.body
            const findProfile = await Profile.findOne({
                userId: req.params.userId
            })
            let teamNew = new Team(body)

            let member = {
                userId: req.params.userId,
                profileId: findProfile._id
            }

            teamNew.members.push(member)
            await teamNew.save(teamNew)

            res.status(201).send({
                status: 201,
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
                    status: 400,
                    message: 'Data not found!'
                })
            }

            res.status(201).send({
                status: 201,
                message: 'Data found!',
                result: findTeam
            })
        } catch (error) {
            errorHandler(res, error)
        }
    }
}