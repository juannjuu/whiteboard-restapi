module.exports = (res, error) => {
    res.status(500).json({
        message: error.message,
        status: "Internal Server Error"
    })
}