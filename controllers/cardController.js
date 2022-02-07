const Card = require('../models/card')

module.exports = {
    async getAll(req, res) {
        try {
            const indexCard = await Card.find({ 
                    listId: req.params.listId,
                    isArchieved: {
                        $ne: true
                    }
            })

            if(!indexCard) {
                res.status(400).json({
                    message: 'Card is empty',
                    result: {}
                })
            }

            res.status(201).send({
                status: 201,
                message: 'Data found!',
                result: indexCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async createCard(req, res) {
        const body = req.body
        try {
            let listId = req.params.listId
            const cardNew = new Card({listId, ...body})

            await cardNew.save(cardNew)
                .then((cardNew) => {
                    res.status(201).send({
                        message: 'Created Succesfully',
                        result: cardNew
                    })
                })

        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async getDetail(req, res) {
        try {
            const getCard = await Card.findOne({
                _id: req.params.cardId
            })

            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }

            res.status(201).send({
                status: 201,
                message: 'Data found!',
                result: getCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async updateCard(req, res) {
        const body = req.body
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })

            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }

            const updateCard = await Card.updateOne({_id: cardId}, body)

            res.status(201).send({
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async postPriority(req, res) {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })

            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }

            const updateCard = await Card.updateOne({_id: cardId}, {priority: req.body.priority})

            res.status(201).send({
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async postLabel(req, res) {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })

            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }

            const updateCard = await Card.updateOne({_id: cardId}, {labels: req.body.labels})

            res.status(201).send({
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async postAssignTo(req, res) {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })

            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }

            const updateCard = await Card.updateOne({_id: cardId}, {assignTo: req.body.assignTo})

            res.status(201).send({
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async getUserTask(req, res) {
        try {
            const findCard = await Card.findOne({
                assignTo: {
                    $elemMatch: {
                        userId: req.params.userId
                    }
                }
            })

            if (!findCard) {
                res.status(400).json({
                    message: 'There is no card!',
                    result: {}
                })
            }

            res.status(200).send({
                message: 'Task Found!',
                result: findCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async postArchieved(req, res) {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })

            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }

            const updateCard = await Card.updateOne({_id: cardId}, {isArchieved: true})

            res.status(201).send({
                message: 'Archieved Succesfully',
                result: updateCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async getArchieved(req, res) {
        try {
            const indexCard = await Card.find({ 
                    listId: req.params.listId,
                    isArchieved: {
                        $eq: true
                    }
            })

            if(!indexCard) {
                res.status(400).json({
                    message: 'Card is empty',
                    result: {}
                })
            }

            res.status(201).send({
                status: 201,
                message: 'Data found!',
                result: indexCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async getComment(req, res) {
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
                status: 201,
                message: 'Data found!',
                result: getCard.comments
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async postComment(req, res) {
        const cardId = req.params.cardId
        try {
            const getCard = await Card.findOne({
                _id: cardId
            })

            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }

            const updateCard = await Card.updateOne({_id: cardId}, {comments: req.body.comments})

            res.status(201).send({
                message: 'Update Succesfully',
                result: updateCard
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },
}