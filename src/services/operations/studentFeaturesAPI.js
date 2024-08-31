import { apiConnector } from "../apiconnector";
import { studentEndpoints } from "../apis";
import { toast } from "react-hot-toast";
import rzpLoga from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection"
      );
      return;
    }
    console.log("Before Capture Payment");
    // Initating the order in Backend
    const orderResponse = await apiConnector(
      "Post",
      COURSE_PAYMENT_API,
      {
        courses,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("OrderResponse", orderResponse);
    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    // options
    const options = {
      key: "rzp_test_X0C4FvqzaWxElO",
      currency: orderResponse.data.data.currency,

      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for your purchasing the Course",

      image: rzpLoga,
      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },
      handler: function (response) {
        // Send successful wala mail
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.data.amount,
          token
        );
        // verifyPayment
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };

    // console.log("After Verify Payment", options);

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.");
      console.log(response.error);
    });
    console.log("Options", options);
  } catch (error) {
    console.log("PAYMENT API ERROR....", error);
    toast.error("Could not make Payment");
  }
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    console.log("Inside PaymentSuccess email box");
    console.log(response.razorpay_order_id);
    console.log(response.razorpay_payment_id);
    console.log(amount);
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("Error while sending the payment mail");
  }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));
  // console.log("BodyData", bodyData);
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    console.log("Inside Verify Payment", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful. You are added to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR...", error);
    toast.error("Could not verify Payment");
  }

  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { buyCourse } from "../services/operations/studentFeaturesAPI";
// import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
// import { setCourse } from "../slices/courseSlice";
// import GetAvgRating from "../utils/avgRating";
// import Error from "./Error";
// import ConfirmationModal from "../components/core/HomePage/Common/ConfirmationModal";
// import RatingStars from "../components/core/HomePage/Common/RatingStars";
