const { data } = require('./data.js');
const Listing = require('../models/listing.js');
const mongoose = require('mongoose');

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderland');
}

main()
.catch(err => console.log(err))

async function initDB(){
    await Listing.deleteMany({});
    const mod_data = data.map((listing) => {
        return {
            ...listing,
            owner: '6803cd3576fdb7ea3ab8a3c7'
        };
    });
    await Listing.insertMany(mod_data);
    console.log('Database initialized with data');
}

initDB()
.then(() => console.log('Database initialized'))
.catch(err => console.log(err))