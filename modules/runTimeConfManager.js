//run time conf
const fs = require('fs')
const path = require('path')

function readRuntimeConfig() {
    try {
        let runtimeconf = JSON.parse(fs.readFileSync(path.join(__dirname, "..","runtimeconf.json")))
        return runtimeconf
    } catch (error) {
        console.error("There was an error while parsing runtimeconf. Please check runtimeconf file. (If you are user, contact the developer) Error is:", error)
    }
}

module.exports = { readRuntimeConfig }