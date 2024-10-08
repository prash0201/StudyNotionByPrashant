import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../HomePage/Common/IconBtn";
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";
import { useNavigate } from "react-router-dom";

const RenderTotalAmounts = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id);

    console.log("Bought these courses: ", courses);
    // TODO: Api integrate karna hai payment se
    buyCourse(token, courses, user, navigate, dispatch);
  };
  return (
    <div>
      <p>Total:</p>
      <p>Rs. {total}</p>

      <IconBtn
        text="Buy Now"
        onClick={handleBuyCourse}
        customClasses={"w-full justify-center"}
      />
    </div>
  );
};

export default RenderTotalAmounts;
