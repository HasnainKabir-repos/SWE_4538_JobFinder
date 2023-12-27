const jwt = require('jsonwebtoken');

async function generateJwt(user) {
    const payload = {
        sub: user._id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET,{algorithm: 'HS256'});
    return token;
}

module.exports = generateJwt;