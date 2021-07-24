const express = require('express');
const controller = require('./post.controller');    // ami használja a post service-et ami használja a post modelt.  Szépen fel van építve

const router = express.Router();

router.get('/:id', (req, res, next) => {
    return controller.findOne(req, res, next);
})

router.post('/', (req, res, next) => {      // ha kap egy postot a gyökérre
    return controller.create(req, res, next);
});

module.exports = router;

