import mongoose from "mongoose";

const mapPinSchema = new mongoose.Schema({
    pokemonID: {
        type: Number,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }, 
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    strict: false
});

const MapPin = mongoose.model("MapPin", mapPinSchema);

export default MapPin;