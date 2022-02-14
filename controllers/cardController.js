const Card = require('../models/card')
const User = require('../models/user')
const errorHandler = require('../utils/error-handler')

module.exports = {
    getAll : async (req, res) => {
        try {
            const indexCard = await Card.find({ 
                    listId: req.params.listId,
                    isArchieved: {
                        $ne: true
                    }
            })
            if(!indexCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Card is empty',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: indexCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    createCard : async (req, res) => {
        const body = req.body
        try {
            let listId = req.params.listId
            const cardNew = new Card({listId, ...body})
            await cardNew.save(cardNew)
                .then((cardNew) => {
                    res.status(201).send({
                        status: 'Created',
                        message: 'Created Succesfully',
                        result: cardNew
                    })
                })

        } catch (error) {
            errorHandler(res, error)
        }
    },
    getDetail : async (req, res) => {
        try {
            const getCard = await Card.findOne({
                _id: req.params.cardId
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: getCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    updateCard : async(req, res) => {
        const body = req.body
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            const updateCard = await Card.updateOne({_id: cardId}, body)
            res.status(201).send({
                status: 'Created',
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    postPriority : async(req, res) => {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            const updateCard = await Card.updateOne({_id: cardId}, {priority: req.body.priority})
            res.status(201).send({
                status: 'Created',
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    postLabel : async(req, res) => {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            const updateCard = await Card.updateOne({_id: cardId}, {labels: req.body.labels})
            res.status(201).send({
                status: 'Created',
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getAssignTo : async(req, res) => {
        try {
            const getCard = await Card.findOne({
                _id: req.params.cardId,
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: getCard.assignTo
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    postAssignTo : async(req, res) => {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            const updateCard = await Card.updateOne(
                {
                    _id: cardId
                }, 
                {
                    $set: {
                        assignTo: req.body.assignTo
                    }
                }
            )
            res.status(200).send({
                status: 'Not Found',
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getUserTask : async(req, res) => {
        try {
            let user = req.user
            const findCard = await Card.find({
                assignTo: {
                    $elemMatch: {
                        userId: user.id
                    }
                }
            })
            if (!findCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'There is no card!',
                    result: {}
                })
            }
            res.status(200).send({
                status: 'OK',
                message: 'Task Found!',
                result: findCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    postArchieved : async(req, res) => {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            const updateCard = await Card.updateOne({_id: cardId}, {isArchieved: true})
            res.status(201).send({
                status: 'Created',
                message: 'Archieved Succesfully',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getArchieved : async(req, res) => {
        try {
            const indexCard = await Card.find({ 
                    listId: req.params.listId,
                    isArchieved: {
                        $eq: true
                    }
            })
            if(!indexCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Card is empty',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: indexCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getComment : async(req, res) => {
        try {
            const getCard = await Card.findOne({
                _id: req.params.cardId,
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: getCard.comments
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    postComment : async(req, res) => {
        const cardId = req.params.cardId
        try {
            let user = req.user
            const findUser = await User.findOne({
                _id: user.id
            })
            const getCard = await Card.findOne({
                _id: cardId
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            let comments = {
                userId: findUser._id,
                name: findUser.name,
                comment: req.body.comment
            }
            const updateCard = await Card.updateOne(
                {
                    _id: cardId
                }, 
                {
                    $push: {
                        comments: comments
                    }
                }
            )
            res.status(201).send({
                status: 'Created',
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getChecklist : async(req, res) => {
        try {
            const getCard = await Card.findOne({
                _id: req.params.cardId,
            })
            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(201).send({
                status: "Created",
                message: 'Data found!',
                result: getCard.checklist
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    addChecklist : async(req, res) => {
        try {
            const getCard = await Card.findOne({
                _id: req.params.cardId,
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            let check = {
                name: req.body.name
            }
            const updateCard = await Card.updateOne(
                {
                    _id: req.params.cardId
                }, 
                {
                    $push: {
                        checklist: check
                    }
                }
            )
            res.status(201).send({
                status: "Created",
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    renameChecklist : async(req, res) => {
        try {
            const getCard = await Card.findOne({
                checklist: {
                    $elemMatch: {
                        _id: req.params.checkId
                    }
                },
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            const updateCard = await Card.updateOne(
                {
                    checklist: {
                        $elemMatch: {
                            _id: req.params.checkId
                        }
                    }
                }, 
                {
                    $set: {
                        'checklist.$.name': req.body.name
                    }
                }
            )
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    deleteChecklist : async(req, res) => {
        try {
            const getCard = await Card.findOne({
                checklist: {
                    $elemMatch: {
                        _id: req.params.checkId
                    }
                },
            })
            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }
            const updateCard = await Card.updateOne(
                {
                    checklist: {
                        $elemMatch: {
                            _id: req.params.checkId
                        }
                    }
                }, 
                {
                    $pull: {
                        'checklist': {
                            _id: req.params.checkId
                        } 
                    }
                }
            )
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    isCheck : async(req, res) => {
        try {
            let checking = true
            const getCard = await Card.findOne({
                checklist: {
                    $elemMatch: {
                        _id: req.params.checkId
                    }
                },
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            for(x of getCard.checklist){
                if(x._id == req.params.checkId && x.isChecked) {
                        checking = false
                }
            }
            const updateCard = await Card.updateOne(
                {
                    checklist: {
                        $elemMatch: {
                            _id: req.params.checkId
                        }
                    }
                },
                {
                    $set: {
                        'checklist.$.isChecked': checking
                    }
                }
            )
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getAttachment : async(req, res) => {
        try {
            const getCard = await Card.findOne({
                _id: req.params.cardId,
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Data found!',
                result: getCard.attachment
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
}