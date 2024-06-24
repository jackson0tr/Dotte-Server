
const mongoose = require("mongoose");


const applyCareerSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: true
        },
        categoryJob: {
            type: String,
            required: [true, "Please enter your career category!"]
        },
        phoneNumber: {
            type: Number,
            required: [true, "Please enter your phone number!"]
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        name: {
            type: String,
            required: [true, "Please enter your name!"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email!"],
        },
        cv: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
    }
)


module.exports = mongoose.model("ApplyCareer", applyCareerSchema);


