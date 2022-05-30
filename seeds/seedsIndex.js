const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log('CONNECTED!');
}

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 250; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6275a6d09f0573eeb2316e16',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci soluta sed ipsam itaque ut quibusdam minima, aliquam ullam, odit nam quis optio aliquid consectetur consequuntur necessitatibus sit incidunt explicabo officiis?',
            images: [
                {
                    url: 'https://res.cloudinary.com/dhdckmsxt/image/upload/v1652653239/YelpCamp/y6wm0inguj5rrnbvztqr.jpg',
                    filename: 'YelpCamp/y6wm0inguj5rrnbvztqr'
                },
                {
                    url: 'https://res.cloudinary.com/dhdckmsxt/image/upload/v1652653239/YelpCamp/ko2c9yqbaftsd1pbadrj.jpg',
                    filename: 'YelpCamp/ko2c9yqbaftsd1pbadrj'
                },
                {
                    url: 'https://res.cloudinary.com/dhdckmsxt/image/upload/v1652653239/YelpCamp/qak9lfbetkvad1f6vgyy.jpg',
                    filename: 'YelpCamp/qak9lfbetkvad1f6vgyy'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})