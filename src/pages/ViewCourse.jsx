import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const courseId = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const setCourseSpecifiedDetails = async () => {
      const courseData = await getFullDetailsOfCourse(courseId.courseId, token);

      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };
    setCourseSpecifiedDetails();
  }, []);
  return (
    <>
      <div className="text-white p-5 pr-5 mb-5">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />

        <div>
          <Outlet />
        </div>
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
