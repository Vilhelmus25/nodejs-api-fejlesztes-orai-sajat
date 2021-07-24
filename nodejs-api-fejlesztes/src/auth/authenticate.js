const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {       // ha sikerült azonosítani az illetőt, akkor beállítjuk a requestnek a usert és úgy engedjük tovább a kérést, hogy már lesz benne egy user, amit majd az adminOnly megfog kapni és megnézi, hogy a usernek milyen role-ja van
        // Bearer afasdagwegawrgadfaefgasgah
        const token = authHeader.split(' ')[1];     // ezzel kivágjuk a tokent
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);     // ha nem sikerül akkor hibaküldés
            }
            req.user = user;
            next();
        });

    } else {      // ha nincs ilyen authHeader
        res.sendStatus(401);        // nem volt elérhető megfelelő információ
    }
};