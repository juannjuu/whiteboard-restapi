const bcrypt = require('bcrypt')

module.exports = {
    hashPassword : (password) => {
        const hash = bcrypt.hash(password, 5)
        return hash
    },
    comparePassword : (password, hash) => {
        const compare = bcrypt.compare(password, hash)
        return compare
    }
}
