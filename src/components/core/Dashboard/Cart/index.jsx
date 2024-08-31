import { useSelector } from "react-redux";

import RenderTotalAmounts from "./RenderTotalAmounts";
import RenderCartCourses from "./RenderCartCourses";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);
  return (
    <div className="text-white">
      <h1>Your Cart</h1>
      <p>{totalItems} Courses in Cart</p>

      {total > 0 ? (
        <div>
          <RenderCartCourses />
          <RenderTotalAmounts />
        </div>
      ) : (
        <p>Your cart is Empty</p>
      )}
    </div>
  );
}
