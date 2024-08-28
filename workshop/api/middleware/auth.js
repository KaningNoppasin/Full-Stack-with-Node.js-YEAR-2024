const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function checkSignIn(req, res, next) {
    try {
        const secret = process.env.TOKEN_SECRET;
        const token = req.headers['authorization'];
        const result = jwt.verify(token, secret);

        if (result !== undefined){
            next();
        }else{
            res.status(401).send({error: "Unauthorized"})
        }
    } catch (e) {
        res.status(500).send({error:e.message});
    }
}

module.exports = {checkSignIn};