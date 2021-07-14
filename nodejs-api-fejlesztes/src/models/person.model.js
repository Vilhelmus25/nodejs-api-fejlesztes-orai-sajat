const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({      // séma, egy Person adatait milyen paraméterek szerint tároljuk
    firstName: String,
    lastName: String,
    email: String
}, {
    timeStamps: true            // egy másik objektum, ami időbéjegekkel látja el mit mikor hoztunk létre
});

module.exports = mongoose.model('Person', PersonSchema);
