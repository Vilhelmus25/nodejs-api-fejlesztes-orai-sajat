const Post = require('../../models/post.model');
const Person = require('../../models/person.model')

exports.create = postData => {      // kapok egy post adatot, amivel létrehozom az új postot
    const post = new Post(postData);
    return post.save()           // egy Promise-t ad vissza
        .then(() => Person.findById(postData.author))
        .then(author => {
            author.posts.push(post._id);
            return author.save();
        })
        .then(() => post);      // ez a vége, itt térek vissza a posttal
}

exports.findOne = id => Post.findById(id).populate('author')        // a populate azt jelenti, hogy kiterjesztjük a postot és hozzácsatoljuk a hozzátartozó authort 
