

module.exports = function auth(req, res, next) {
    const admin = req.user.isAdmin;
    if (!admin) res.status(403).send("Access denied");

    next();
} 