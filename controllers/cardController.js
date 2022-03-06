const Card = require('../models/card')
const List = require('../models/list')
const Board = require('../models/board')
const errorHandler = require('../utils/error-handler')

module.exports = {
    getAll : async (req, res) => {
        try {
            const indexCard = await Card.find(
                { 
                    listId: req.params.listId,
                    isArchieved: {
                        $ne: true
                    }
                }
            )
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
            const getCard = await Card.findOneAndUpdate(
                {
                    _id: cardId
                },
                {
                    $set: body
                },
                {
                    returnDocument: 'after'
                })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            // const updateCard = await Card.updateOne({_id: cardId}, body)
            res.status(201).send({
                status: 'Created',
                message: 'Update Succesfully',
                result: getCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    postPriority : async(req, res) => {
        const cardId = req.params.cardId
        const priority = req.body.priority
        try {
            const getCard = await Card.findOneAndUpdate(
                {
                    _id: cardId
                },
                {
                    $set: {
                        priority: priority
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(201).send({
                status: 'Created',
                message: 'Update Succesfully',
                result: getCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    postLabel : async(req, res) => {
        const cardId = req.params.cardId
        const labels = req.body.labels
        try {
            const getCard = await Card.findOneAndUpdate(
                {
                    _id: cardId
                },
                {
                    $set: {
                        labels: {
                            labels
                        }
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(201).send({
                status: 'Created',
                message: 'Update Succesfully',
                result: getCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getAssignTo : async(req, res) => {
        try {
            const getCard = await Card.findOne({
                _id: req.params.cardId,
            }).populate({
                path: 'assignTo.userId',
                select: 'name'
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
            const getCard = await Card.findOneAndUpdate(
                {
                    _id: cardId
                }, 
                {
                    $push: {
                        assignTo: req.body.assignTo
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: 'Created!',
                message: 'Update Succesfully',
                result: getCard.assignTo
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
            }).populate({path: 'listId', select: 'boardId title'})

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
            const getCard = await Card.findOneAndUpdate(
                {
                    _id: cardId
                },
                {
                    $set: {
                        isArchieved: true
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(201).send({
                status: 'Created',
                message: 'Archieved Succesfully',
                result: getCard
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    allCardArchive : async(req, res) => {
        try {
            const getCard = await Card.find({
                listId: req.params.listId
            })
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            const updateCard = await Card.updateMany(
                {
                    listId: req.params.listId
                },
                {
                    isArchieved: true
                }
            )
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
            }).populate({
                path:'comments.userId',
                select: 'name'
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

            let comments = {
                userId: user.id,
                comment: req.body.comment
            }

            const getCard = await Card.findOneAndUpdate(
                {
                    _id: cardId
                },
                {
                    $push: {
                        comments: comments
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(201).send({
                status: 'Created',
                message: 'Update Succesfully',
                result: getCard.comments
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
            let check = {
                name: req.body.name
            }

            const getCard = await Card.findOneAndUpdate(
                {
                    _id: req.params.cardId,
                },
                {
                    $push: {
                        checklist: check
                    }
                },
                {
                    returnDocument: 'after'
                }
            )

            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
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
    renameChecklist : async(req, res) => {
        try {
            const getCard = await Card.findOneAndUpdate(
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
                },
                {
                    returnDocument: 'after'
                }
            )
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Renamed Successfully!',
                result: getCard.checklist
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    deleteChecklist : async(req, res) => {
        try {
            const updateCard = await Card.findOneAndUpdate(
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
                },
                {
                    returnDocument: 'after'
                }
            )
            if(!updateCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Deleted Successfully!',
                result: updateCard.checklist
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
                },
                {
                    // returnDocument: 'after'
                    new: true
                }
            )
            res.status(200).send({
                status: "OK",
                message: 'Checked!',
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

    postAttachment : async(req, res) => {
        try {
            let attachments = []
            
            for(let i = 0; i < req.files.length; i++) {
                let fileName = req.files[i].originalname.split('.')

                let attachment = {
                    fileName: fileName[0],
                    linkFile: req.files[i].path
                }
                attachments.push(attachment)
            }
            const getCard = await Card.findOneAndUpdate(
                {
                    _id: req.params.cardId
                },
                {
                    $push: {
                        attachment: attachments
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
            
            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }

            res.status(201).send({
                status: 'Created!',
                message: 'Add attachment Succesfully',
                result: getCard.attachment
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },

    renameAttachment : async(req, res) => {
        try {
            const getCard = await Card.findOneAndUpdate(
                {
                    attachment: {
                        $elemMatch: {
                            _id: req.params.attachmentId
                        }
                    }
                }, 
                {
                    $set: {
                        'attachment.$.fileName': req.body.fileName
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
            if(!getCard) {
                res.status(400).json({
                    status: 'Not Found',
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Renamed Successfully!',
                result: getCard.attachment
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },

    deleteAttachment : async(req, res) => {
        try {
            const getCard = await Card.findOneAndUpdate(
                {
                    attachment: {
                        $elemMatch: {
                            _id: req.params.attachmentId
                        }
                    }
                }, 
                {
                    $pull: {
                        'attachment': {
                            _id: req.params.attachmentId
                        } 
                    }
                }, 
                {
                    returnDocument: 'after'
                }
                )
            if(!getCard) {
                res.status(400).json({
                    message: 'Data not found',
                    result: {}
                })
            }
            res.status(200).send({
                status: "OK",
                message: 'Delete Success!',
                result: getCard.attachment
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },

    copyAllCard : async(req, res) => {
        try {
            let pasteArray = []
            let arr = []
            let obj
            const indexCard = await Card.find(
                { 
                    listId: req.params.listId,
                    isArchieved: {
                        $ne: true
                    }
                },
                {
                    _id: 0
                }
            )

            for(let i = 0; i < indexCard.length; i++) {
                indexCard[i].listId = req.params.listDest
                for(let j of indexCard[i].attachment) {
                    obj = {}
                    obj.fileName = j.fileName
                    obj.linkFile = j.linkFile
                    arr.push(obj)
                }
                indexCard[i].attachment = arr
                arr = []
                for(let k of indexCard[i].assignTo) {
                    obj = {}
                    obj.userId = k.userId
                    arr.push(obj)
                }
                indexCard[i].assignTo = arr
                arr = []
                for(let l of indexCard[i].comments) {
                    obj = {}
                    obj.userId = l.userId
                    obj.comment = l.comment
                    arr.push(obj)
                }
                indexCard[i].comments = arr
                arr = []
                for(let m of indexCard[i].checklist) {
                    obj = {}
                    obj.name = m.name
                    obj.isChecked = m.isChecked
                    arr.push(obj)
                }
                indexCard[i].checklist = arr
                indexCard[i].createdAt = Date.now()
                pasteArray.push(indexCard[i])
            }

            const newArray = await Card.insertMany(pasteArray)

            res.status(200).json({
                status: 200,
                message: 'Copied Successfully',
                result: newArray
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },

    copyOneCard : async(req, res) => {
        try {
            let arr = []
            let obj
            const getCard = await Card.findOne(
                {
                    _id: req.params.cardId
                },
                {
                    _id: 0
                }
            )
            
            getCard.listId = req.params.listDest
            for(let j of getCard.attachment) {
                obj = {}
                obj.fileName = j.fileName
                obj.linkFile = j.linkFile
                arr.push(obj)
            }
            getCard.attachment = arr
            arr = []
            for(let k of getCard.assignTo) {
                obj = {}
                obj.userId = k.userId
                arr.push(obj)
            }
            getCard.assignTo = arr
            arr = []
            for(let l of getCard.comments) {
                obj = {}
                obj.userId = l.userId
                obj.comment = l.comment
                arr.push(obj)
            }
            getCard.comments = arr
            arr = []
            for(let m of getCard.checklist) {
                obj = {}
                obj.name = m.name
                obj.isChecked = m.isChecked
                arr.push(obj)
            }
            getCard.checklist = arr
            getCard.createdAt = Date.now()
            
            const pasteCard = await Card.insertMany(getCard)

            res.status(200).json({
                status: 200,
                message: 'Successfully paste',
                result: pasteCard
            })
        } catch(error) {
            errorHandler(res, error)
        }
    }
}