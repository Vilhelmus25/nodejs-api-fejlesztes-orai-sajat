const Person = require('../../models/person.model');

exports.create = personData => {
    const person = new Person(personData);
    return person.save();
}

// hogy rugalmassan tudjunk dolgozni és a tesztelésben más értékekkel tudjunk dolgozni, ez ahhoz van

exports.findAll = () => Person.find().populate('posts');

//exports.findOne = id => Person.findById(id);
exports.findOne = id => Person.findById(id).populate('posts');

exports.update = (id, updateData) => Person.findByIdAndUpdate(id, updateData, { new: true });

exports.delete = id => Person.findByIdAndRemove(id);