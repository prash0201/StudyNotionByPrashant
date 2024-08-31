import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../HomePage/Common/IconBtn";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, []);

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  const handleCoursePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId", course._id);
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);
    setLoading(true);
    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }
    setLoading(false);
  };

  const onSubmit = (data) => {
    handleCoursePublish();
  };
  return (
    <div className="rounded-md border-[1px] bg-richblack-800 border-richblack-700 text-white">
      <p>Publish Course</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="rounded h-4 w-4"
            />
            <span className="ml-4">Make this Course a Publish </span>
          </label>
        </div>

        <div className="flex justify-end gap-x-3 ">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex items-center rounded-md bg-richblack-300 p-4"
          >
            {" "}
            Back
          </button>

          <IconBtn disabled={loading} text="save changes" />
        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
