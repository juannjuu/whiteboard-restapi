const Card = require('../models/card')
const User = require('../models/user')

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

    async getAssignTo(req, res) {
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
                result: getCard.assignTo
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
            const findCard = await Card.find({
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
                msgError: error.message
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
            const findUser = await User.findOne({
                _id: '6201c9c5f026540254bdf702'
            })

            const getCard = await Card.findOne({
                _id: cardId
            })

            if(!getCard) {
                res.status(400).json({
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

    async getChecklist(req, res) {
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
                result: getCard.checklist
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error
            })
        }
    },

    async addChecklist(req, res) {
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
                status: 201,
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error.message
            })
        }
    },

    async renameChecklist(req, res) {
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
                    $set: {
                        'checklist.$.name': req.body.name
                    }
                }
            )

            res.status(201).send({
                status: 201,
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error.message
            })
        }
    },

    async deleteChecklist(req, res) {
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

            res.status(201).send({
                status: 201,
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error.message
            })
        }
    },

    async isCheck(req, res) {
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
                    $set: {
                        'checklist.$.isChecked': true
                    }
                }
            )

            res.status(201).send({
                status: 201,
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error.message
            })
        }
    },

    async isUnCheck(req, res) {
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
                    $set: {
                        'checklist.$.isChecked': false
                    }
                }
            )

            res.status(201).send({
                status: 201,
                message: 'Data found!',
                result: updateCard
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Internal Server Error',
                msgError: error.message
            })
        }
    },

    async getAttachment(req, res) {
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
                result: getCard.attachment
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