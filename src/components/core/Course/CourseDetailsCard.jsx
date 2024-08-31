import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";

export default function CourseDetailsCard({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) {
  const { thumbnail: thumbNailImage, price: CurrentPrice } = course;
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Print course in card", course);
  }, []);
  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are a instructor, ypu can't buy a course");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }

    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to add to cart",
      btn1Text: "login",
      btn2Text: "cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };
  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };
  return (
    <div className="text-white">
      <img
        src={thumbNailImage}
        alt="Thumbnail-Image"
        className="max-h-[300px] min-h-[180px] w-[400px] rounded-xl"
      />
      <div>Rs. {CurrentPrice}</div>
      <div className="flex flex-col gap-y-6 ">
        <button
          className="bg-yellow-50"
          onClick={
            user && course?.studentsEnrolled.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
        >
          {user && course?.studentsEnrolled.includes(user?._id)
            ? "Go to Course"
            : "Buy Now"}
        </button>

        {!course?.studentsEnrolled.includes(user?._id) && (
          <button onClick={handleAddToCart} className="bg-yellow-50">
            Add to Cart
          </button>
        )}
      </div>

      <div>
        <p>30-Day Money-Back Gurantee</p>
        <p>This course Includes:</p>

        <div className="flex flex-col gap-y-3">
          {course?.instructions?.map((item, index) => (
            <p key={index} className="flex gap-2">
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="mx-auto flex items-center gap-2 p-6 text-yellow-5">
        <button onClick={handleShare}>Share</button>
      </div>
    </div>
  );
}
