const jwt = require('jsonwebtoken');
const user = require('../models/user');

async function requireAuth(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({error: 'Authorisation token required'});
    }

    const token = authorization.split(' ')[1];

    try {
        const {id} = jwt.verify(token, process.env.SECRET);

        req.user = await user.findOne({id}).select('_id');
        next();
    } catch (err) {
        res.status(401).json({error: 'Request is not authorised'});
    }

}

module.exports = { requireAuth };