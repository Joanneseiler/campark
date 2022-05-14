const mongoose = require('mongoose');

const { faker } = require('@faker-js/faker');
const User = require('../models/User.model');
const Place = require('../models/Place.model');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/campark';


const executeSeeds = async () => {
    const mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    };

    let mongooseConnection;

    try {
        mongooseConnection = await mongoose.connect(MONGO_URI, mongooseOptions);
        console.log(`Connected to Mongo! Database name: "${mongooseConnection.connections[0].name}"`);
    } catch (err) {
        console.error("Error connecting to mongo: ", err);
        process.exit("Error");
    }

    const connection = mongooseConnection.connections[0];
    await connection.db.dropDatabase();


    let users = Array.from({
        length: 10,
      }).map((_) => {
        return {'username': faker.name.findName()}
    });

    users = await Promise.all(users.map(async (user) => {
        return User.create({ username: user.username});
    }));

    console.log(faker.random.arrayElement(users));

    let places = [{
        latitude: 53.0864749766181, 
        longitude: 8.858139181197883,
        address: 'Scharnhorststraße 115\n28211 Bremen',
        description: 'Ein schöner Parkplatz, der keiner ist',
        price: "free",
        rate: 3,
        authorId: faker.random.arrayElement(users)._id
        //put the name of author -> J.K. Rowling -> find by name
        // after you found data of J.K. -> grab id
    }];

    await Promise.all(places.map(async (place) => {
        return Place.create(place);
    }));
    
    //let knufflein = await User.create({ username: faker.name.findName()})
    /*let knuffleinPlace = await Place.create({
        latitude: 53.0864749766181, 
        longitude: 8.858139181197883,
        address: 'Scharnhorststraße 115\n28211 Bremen',
        description: 'Ein schöner Parkplatz, der keiner ist',
        price: "free",
        rate: 3,
        authorId: users[faker.datatype.number({min: 0, max: users.length-1})]._id
    })*/

    mongoose.connection.close();
};

executeSeeds();



// all inside try block
// also later figure out how to hash password


