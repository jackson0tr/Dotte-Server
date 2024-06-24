const express = require("express");
const Career = require("../model/career");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");

// create job
router.post("/create-career", catchAsyncErrors(async (req,res,next)=>{
    try{
        const {title,description,experience,salary,jobType,jobPlace,skills,category} = req.body;

    const career = await Career.create(
        {
            title,
            description,
            experience,
            salary,
            jobType,
            jobPlace,
            skills,
            category}
        )

    res.status(201).json({
        success: true,
        career
    });
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}))

// edit job
router.put("/edit-career/:id", catchAsyncErrors(async (req,res,next)=>{
    try{
        const {title,description,experience,salary,jobType,jobPlace,skills,category} = req.body;
        const jobId = req.params.id;

        const career = await Career.findByIdAndUpdate(jobId, {$set:{title,description,experience,salary,jobType,jobPlace,skills,category}}, {new:true});

        res.status(201).json({
            success: true,
            career,
          });

    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}));

// get job 
router.get("/get-career/:id", catchAsyncErrors(async (req,res,next)=>{
    try{
        const career = await Career.findById(req.params.id);

        res.status(201).json({
            success: true,
            career,
          });
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}));

// get all jobs
router.get("/get-all-careers", catchAsyncErrors(async (req,res,next)=>{
    try{
        const careers = await Career.find().sort({
            createdAt: -1
        })

        res.status(201).json({
            success: true,
            careers
        })
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}));

// delete job
router.delete("/delete-career/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req,res,next)=>{
    try{
        const career = await Career.findById(req.params.id);

        if(!career){
            return next(
                new ErrorHandler("Career is not available with this id", 400)
              );
        }

        await Career.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: "Career deleted successfully!",
          });

    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}))



module.exports = router;