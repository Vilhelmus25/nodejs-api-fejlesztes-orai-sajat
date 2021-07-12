.gitignore generáláshoz:
https://www.toptal.com/developers/gitignore

VisualStudioCode; Node

/**************************************

A package.json generálásához
npm init -y

/*****************************************/

A package.json- ön belül a scriptek után kell egy dependencies és abban felvettük az express-t. 
A ""-ben felkínálja a verziókat.
Majd npm i a függőségek telepítésére.

/*******************************************/

Ez nem árt a package.json-be a scriptek közé:
"start": "node src/index.js",
Akkor 'npm start' kell

/********************************************/
## Test api
### Create
```Javascript
fetch('http://localhost:3000/person', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({first_name: 'Jack', last_name: 'London', email: 'jl@gmail.com'})
}).then(r => r.json() )
.then( d => console.log(d) );
```

### Update
``` Javascript
fetch('http://localhost:3000/person/6', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({first_name: 'Jack', last_name: 'London', email: 'jack.london@gmail.com'})
}).then(r => r.json() )
.then( d => console.log(d) );
```