const mongoose = require("mongoose");


const careerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        experience: {
            type: Number,
            required: true
        },
        salary: {
            type: Number,
            required: true
        },
        jobType: {
            type: String,
            required: true
        },
        jobPlace: {
            type: String,
            required: true
        },
        skills: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: [true, "Please enter your career category!"]
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
       
    }
)


module.exports = mongoose.model("Career", careerSchema);
