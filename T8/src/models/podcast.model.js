import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlenght: 3,
        },
        description: {
            type: String,
            required: true,
            minlenght: 10,
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category:{
            type: String,
            enum:['tech', 'science', 'art', 'history', 'other'],
            required: true,
        },

        episodes:{
            type: Number,
            default: 1,
        },

        published: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Podcast = mongoose.model("Podcast", userSchema);

export default Podcast;

