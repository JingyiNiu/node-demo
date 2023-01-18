const bcrypt = require("bcrypt")

const run = async() => {
    const salt = await bcrypt.genSalt(10)
    console.log(salt)
    const hashedPwd = await bcrypt.hash("1234", salt)
    console.log(hashedPwd)
}

run()