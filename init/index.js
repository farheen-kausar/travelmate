require("dotenv").config({
    path: require("path").join(__dirname, "..", ".env")
});

const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/travelmate";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const getCategory = (listing) => {
    const text = `${listing.title} ${listing.description} ${listing.location}`.toLowerCase();

    if (text.includes("beach") || text.includes("island") || text.includes("coast")) {
        return "Beaches";
    }

    if (text.includes("mountain") || text.includes("hill") || text.includes("valley")) {
        return "Mountains";
    }

    if (text.includes("castle") || text.includes("fort")) {
        return "Castles";
    }

    if (text.includes("pool") || text.includes("swimming")) {
        return "Pools";
    }

    if (text.includes("camp") || text.includes("forest")) {
        return "Camping";
    }

    if (
        text.includes("snow") ||
        text.includes("arctic") ||
        text.includes("ice") ||
        text.includes("igloo")
    ) {
        return "Arctic";
    }

    if (
        text.includes("city") ||
        text.includes("urban") ||
        text.includes("downtown")
    ) {
        return "Iconic Cities";
    }

    return "Trending";
};

const initDB = async () => {
    await Listing.deleteMany({});

    const listings = [];

    for (const obj of initData.data) {

        const query = `${obj.location}, ${obj.country}`;

        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
            {
                params: {
                    access_token: process.env.MAP_TOKEN,
                    limit: 1
                }
            }
        );

        const coordinates =
            response.data.features[0]?.geometry?.coordinates;

        if (!coordinates) {
            console.log(`Could not find coordinates for ${query}`);
            continue;
        }

        listings.push({
            ...obj,
            owner: "6aaff2b96cab140d36d460d5",
            category: getCategory(obj),
            geometry: {
                type: "Point",
                coordinates: coordinates
            }
        });
    }

    await Listing.insertMany(listings);

    console.log("data was initialized");
};

initDB();