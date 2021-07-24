const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({      // séma, egy Person adatait milyen paraméterek szerint tároljuk
    firstName: String,
    lastName: String,
    email: String,
    // mivel egy personnak one to many kapcsolata van a posttal, ezért egy personnak több postja lehet, egy postok tömbje lesz akkor:
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]

}, {
    timeStamps: true            // egy másik objektum, ami időbéjegekkel látja el mit mikor hoztunk létre
});

module.exports = mongoose.model('Person', PersonSchema);
