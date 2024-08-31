import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../../services/apiconnector";
import { contactusEndpoint } from "../../../services/apis";

import CountryCode from "../../../data/countrycode.json";
const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Logging Data", data);
    try {
      setLoading(true);

      // const response = await apiConnector(
      //   "POST",
      //   contactusEndpoint.CONTACT_US_API,
      //   data
      // );

      const response = { status: "ok" };
      console.log("Logging response", response);
      setLoading(false);
    } catch (err) {
      console.log("Error", err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-5">
          {/* firstName */}
          <div className="flex flex-col">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first name"
              {...register("firstName", { required: true })}
            ></input>

            {errors.firstName && <span> Please enter your name</span>}
          </div>

          {/* lastName */}
          <div className="flex flex-col">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter last name"
              {...register("lastName")}
            ></input>
          </div>
        </div>

        <div className=" flex flex-col gap-5">
          {/* email */}
          <div className="flex flex-col">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              {...register("email")}
            ></input>
          </div>

          {/* phone no. */}

          <div className="flex flex-col gap-2">
            <label htmlFor="phonenumber" className="lable-style">
              Phone Number
            </label>

            <div className="flex gap-5">
              <div className="flex w-[81px] flex-col gap-2">
                <select
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="Enter first name"
                  className="form-style bg-richblack-700 text-white"
                  {...register("countrycode", { required: true })}
                >
                  {CountryCode.map((ele, i) => {
                    return (
                      <option key={i} value={ele.code}>
                        {ele.code} -{ele.country}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                <input
                  type="number"
                  name="phonenumber"
                  id="phonenumber"
                  placeholder="12345 67890"
                  className="form-style bg-richblack-700 text-white"
                  {...register("phoneNo", {
                    required: {
                      value: true,
                      message: "Please enter your Phone Number.",
                    },
                    maxLength: { value: 12, message: "Invalid Phone Number" },
                    minLength: { value: 10, message: "Invalid Phone Number" },
                  })}
                />
              </div>
            </div>
            {errors.phoneNo && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.phoneNo.message}
              </span>
            )}
          </div>

          {/* message */}
          <div className="flex flex-col">
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              cols="30"
              rows="7"
              placeholder="Enter Your message here"
              {...register("message", { required: true })}
            ></textarea>
            {errors.message && <span>Please enter your message.</span>}
          </div>

          <button
            type="submit"
            className="rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black"
          >
            Send message
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactUsForm;
