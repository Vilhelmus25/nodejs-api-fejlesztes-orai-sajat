const mongoose = require('mongoose');
// npm i mongoose-id-validator          Ezt a csomagot is telepíteni kellett, ez az id validációjáért felel.
const idValidator = require('mongoose-id-validator');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {         // a szerző mongodb-s azonosítója         ; egy postnak egy authora van, egy personja van.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',       // ez egy olyan id, ami a Person kollekcióban található entitásokra mutat
        required: true
    }           // a person szempontjából ez egy one->many kapcsolat a post, viszont a post szempontjából one->one, mert csak egy authora lehet egy postnak; a personnek, meg postok tömbje lehet
}, {
    timestamps: true        // fog automatikusan időbélyegeket menteni
});

PostSchema.plugin(idValidator);     // ez megnézi, hogy jó authorvalidatort adtunk-e meg

module.exports = mongoose.model('Post', PostSchema);
