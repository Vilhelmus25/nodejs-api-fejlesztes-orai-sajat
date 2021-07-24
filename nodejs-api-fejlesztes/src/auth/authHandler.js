const jwt = require('jsonwebtoken');

const Users = [
    {
        username: 'admin',
        password: 'admin_pw',
        role: 'admin'
    },
    {
        username: 'user',
        password: 'user_pw',
        role: 'user'
    }
];

const refreshTokens = [];


module.exports.login = (req, res) => {      // itt a module.exports után .login van!!!!
    const { username, password } = req.body;

    const user = Users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        // login token
        const accessToken = jwt.sign({
            username: user.username,
            role: user.role
            //  a jelszót semmilyen formában nem küldjük ki a kliensenek
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY     // ez plusz a loginhoz képest
        });
        //refresh token
        const refreshToken = jwt.sign({
            username: user.username,
            role: user.role
            //  a jelszót semmilyen formában nem küldjük ki a kliensenek
        }, process.env.REFRESH_TOKEN_SECRET);      // refresh tokennel írjuk alá
        // nem lesz lejárata
        refreshTokens.push(refreshToken);

        res.json({
            accessToken, // elhagyható a kulcs-érték jelölés, mert ugyanaz a nevük
            refreshToken        // a refresh tokent is visszaküldjük, hogy tudjunk új tokent küldeni, ha lejárt
        });
    } else {
        res.send('Username or password incorrect.');
    }
};

module.exports.refresh = (req, res, next) => {

    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(401);
    }
    // ha ezeken átjutott, akkor van token és szerepel az eddig kiadott tokenek közt

    const authHeader = req.headers.authorization;

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {    // a refresh tokennel most.
        if (err) {
            return res.sendStatus(403);     // ha nem sikerül akkor hibaküldés
        }

        const accessToken = jwt.sign({
            username: user.username,
            role: user.role
            //  a jelszót semmilyen formában nem küldjük ki a kliensenek
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY     // ez plusz a loginhoz képest
        });

        res.json({
            accessToken // elhagyható a kulcs-érték jelölés, mert ugyanaz a nevük
        });
    });

};

module.exports.logout = (req, res) => {
    const { token } = req.body; // el kell küldeni a tokent, hogy kit szeretnénk kijelentkeztetni.

    if (!refreshTokens.includes(token)) {
        res.sendStatus(403);
    }

    const tokenIndex = refreshTokens.indexOf(token);
    refreshTokens.splice(tokenIndex, 1);

    res.sendStatus(200);
}

