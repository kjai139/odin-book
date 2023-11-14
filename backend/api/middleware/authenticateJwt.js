const passport = require('../../passport')
const jwtStrategy = require('passport-jwt').Strategy


const options = {}
const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['jwt']
    }

    return token
}



exports.authenticateJwt = (req, res) => {

}