const { instance } = require("../config/razorpay");
const Course = require("../models/Courses");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const CourseProgress = require("../models/CourseProgress");

const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
// const { default: mongoose } = require("mongoose");

// capture the payment and initiate the Razorpay order

exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;
  if (courses.length === 0) {
    return res.json({
      success: false,
      message: "Please Provide course Id",
    });
  }

  let total_amount = 0;

  for (const course_id of courses) {
    let course;

    try {
      // Find the course by its Id
      course = await Course.findById(course_id);
      // If course is not found then return error
      if (!course) {
        return res.status(200).json({
          success: false,
          message: "Could not find the course",
        });
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId);

      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already Enrolled",
        });
      }
      // console.log("Print UID", uid);
      // Add the price of the course to the total amount

      total_amount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    // console.log("Hello hiiii");
    const paymentResponse = await instance.orders.create(options);

    res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;

  const userId = req.user.id;

  // console.log(" Order id", razorpay_order_id);
  // console.log("Payment id", razorpay_payment_id);
  // console.log(razorpay_signature);
  // console.log(courses);
  // console.log(userId);
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  console.log("ExpectedSignature", expectedSignature);
  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }
  // console.log("Inside the Send payment success mail box");

  try {
    const enrolledStudent = await User.findById(userId);
    // console.log("Print enrolled student", enrolledStudent);
    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res.status(500).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      // console.log("Enrolled student: ", enrolledStudent);
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      // console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};

// exports.capturePayment = async (req, res) => {
//   // get courseId and userId
//   const { course_id } = req.body;
//   const userId = req.user.id;
//   // validation
//   if (!course_id) {
//     return res.json({
//       success: false,
//       message: "Please provide valid course ID",
//     });
//   }

//   // valid courseId
//   let course;
//   try {
//     course = await Course.findById(course_id);
//     if (!course) {
//       return res.json({
//         success: false,
//         message: "Could not find the course",
//       });
//     }

//     // user already pay for the same course

//     const uid = new mongoose.Types.ObjectId(userId);
//     if (course.studentsEnrolled.include(uid)) {
//       return res.status(200).json({
//         success: false,
//         message: "Student is already enrolled",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }

//   // order create
//   const amount = course.price;
//   const currency = "INR";

//   const options = {
//     amount: amount * 100,
//     currency: currency,
//     receipt: Math.random(Date.now()).toString(),
//     notes: {
//       courseId: course_id,
//       userId,
//     },
//   };

//   try {
//     // initiate the payment using razorpay
//     const paymentResponse = await instance.orders.create(options);
//     console.log(paymentResponse);

//     // return response
//     return res.status(200).json({
//       success: false,
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       thumbnail: course.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: "Could not initiate order",
//     });
//   }
// };

// // verify Signature of Razorpay and Server
// exports.verifySignature = async (req, res) => {
//   const webHookSecret = "12345678";
//   // razorpay me "x-razorpay-signature" key ke andar secret key or Signature hota hai
//   const signature = req.headers("x-razorpay-signature");

//   const shasum = crypto.createHmac("sha256", webHookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   if (digest === signature) {
//     console.log("Payment is Authorised");

//     const { courseId, userId } = req.body.payload.payment.entity.notes;

//     try {
//       //  fulfil the action

//       // find the course and enroll the student in it

//       const enrolledCourse = await Course.findOneAndUpdate(
//         { _id: courseId },
//         {
//           $push: {
//             studentsEnrolled: userId,
//           },
//         },
//         { new: true }
//       );

//       if (!enrolledCourse) {
//         return res.status(500).json({
//           success: false,
//           message: "Course not Found",
//         });
//       }
//       console.log(enrolledCourse);
//       // find the student and add the course to their list enrolled courses me

//       const enrolledStudent = await User.findOneAndUpdate(
//         {
//           _id: userId,
//         },
//         { $push: { courses: courseId } },
//         { new: true }
//       );

//       console.log(enrolledStudent);

//       // confirmation ka mail send karna hai
//       const emailResponse = await mailSender(
//         enrolledStudent.email,
//         "Conratulations from CodeHelp",
//         "Congratulations, You are onboarded into new CodeHelp Course"
//       );
//       console.log(emailResponse);
//       return res.status(200).json({
//         success: true,
//         message: "Signature verified and Course added",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   } else {
//     return res.status(500).json({
//       success: false,
//       message: "Invalid Signature",
//     });
//   }
// };
