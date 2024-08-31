import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import RenderSteps from "../AddCourses/RenderSteps";

const EditCourse = () => {
  const { token } = useSelector((state) => state.auth);
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    };
    populateCourseDetails();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="text-white">
      <h1>Edit Course</h1>

      <div>{course ? <RenderSteps /> : <p>Courses Not Found</p>}</div>
    </div>
  );
};

export default EditCourse;
