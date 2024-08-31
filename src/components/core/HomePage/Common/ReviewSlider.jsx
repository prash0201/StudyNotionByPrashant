import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
// import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import { FreeMode, Pagination } from "swiper/modules";
// Icons
import { FaStar } from "react-icons/fa";
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { apiConnector } from "../../../../services/apiconnector";
import { ratingsEndpoints } from "../../../../services/apis";
const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    const fetchAllReviews = async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      if (data?.success) {
        setReviews(data?.data);
      }
      console.log("Printing Reviews", reviews);
    };
    fetchAllReviews();
  }, []);
  return (
    <div className="text-white">
      <div className="h-[190px] max-w-maxContent">
        <Swiper
          slidesPerView={4}
          spaceBetween={24}
          loop={true}
          freeMode={true}
          autoplay={{ delay: 250 }}
          modules={{ FreeMode, Pagination, Autoplay }}
          className="w-full"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <img
                src={
                  review?.user?.image
                    ? review?.user?.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                }
                className="h-9 w-9 rounded-full object-cover"
              />
              <p>
                {review?.user?.firstName} {review?.user?.lastName}
              </p>
              <p>{review?.course?.courseName}</p>

              <p>{review?.review}</p>

              <p>{review?.rating.toFixed(1)}</p>

              <ReactStars
                count={5}
                value={review.rating}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaStar />}
                fullIcon={<FaStar />}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;
