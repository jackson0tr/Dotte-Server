const express = require("express");
const Mail = require("../model/mail");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const nodemailer = require("nodemailer");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// send email
router.post("/send-email", catchAsyncErrors(async (req, res, next) => {

  try {

    const { senderName, senderEmail, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    const mailOptions = {
      name: senderName,
      from: senderEmail,
      to: senderEmail,
      subject: subject,
      text: message
    }

    const sendmail = await transporter.sendMail(mailOptions);

    //   await Mail.create({
    //     senderEmail,
    //     senderName,
    //     subject,
    //     message       
    //   })

    res.status(201).json({
      success: true,
      message: "Mail Sent Successfully!!",
      sendmail
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }


}))

// subscribe newsletter
router.post("/subscribe", catchAsyncErrors(async (req, res, next) => {
  try {
    const senderEmail = req.body;

    const isEmailExists = await Mail.findOne(senderEmail);

    if (isEmailExists) {
      return next(new ErrorHandler("Email is already exists", 400));
    }

    const mail = await Mail.create(senderEmail);

    res.status(201).json({
      success: true,
      mail,
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

// get all mail (NEWS LETTER)
router.get("/all-mails", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
  try {
    const mails = await Mail.find().sort({
      createdAt: -1,
    })

    res.status(201).json({
      success: true,
      mails,
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

// delete subscriber
router.delete("/delete-subscriber/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
  try {

    const mail = await Mail.findById(req.params.id);

    if (!mail) {
      return next(
        new ErrorHandler("Mail is not available with this id", 400)
      );
    }

    await Mail.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "Mail deleted successfully!",
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

module.exports = router;
