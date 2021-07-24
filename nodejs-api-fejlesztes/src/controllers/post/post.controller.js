// ez kezeli le majd a http kéréseket
const createError = require('http-errors');
const logger = require('../../config/logger');
const postService = require('./post.service');

exports.create = (req, res, next) => {
    // csinálunk egy ellenőrzést
    const { title, body, author } = req.body;    // kiolvassuk a 3 adatot
    if (!title || !body || !author) {
        return next(new createError.BadRequest('No title, body, or author_Id!'));
    }
    const postData = { title, body, author };       // ezt azért kell, mert nagybetűvel szerepel az authorId

    return postService.create(postData)     // mivel ez egy Promise, ezért így tudok vele dolgozni
        .then(createdPost => {
            res.status(201);
            res.json(createdPost);      // json választ küldök a kérésre
        })
        .catch(err => next(new createError.BadRequest(err.message)));            // így nem küldjük vissza a hibát élesben, mert sebezhetőségi pontot ad, mivel a mongoose hibaüzenete tartalmazza a verziót az adatbázis nevét, stb.
};

exports.findOne = (req, res, next) => {
    return postService.findOne(req.params.id)
        .then(post => {
            if (!post) {
                return next(new createError.BadRequest('Post is not found!'));
            }   // ha nincs akkor hibát dobok
            res.json(post); // ha van post, akkor visszaküldöm
        })
        .catch(err => {
            return next(new createError.InternalServerError(err.message))
        });
}