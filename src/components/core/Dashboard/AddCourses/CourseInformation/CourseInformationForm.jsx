import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { FaRupeeSign } from "react-icons/fa";
import ChipInput from "./ChipInput";

import RequirementField from "./RequirementField";
import { setStep, setCourse } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import IconBtn from "../../../HomePage/Common/IconBtn";

import { COURSE_STATUS } from "../../../../../utils/constants";
import Upload from "../Upload";

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();

      if (categories.length > 0) {
        setCourseCategories(categories);
      }

      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }
    getCategories();
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValue();

    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString()
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = async (data) => {
    // console.log("TOP OFF ONSUBMIT METHOD", data);
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValue();
        const formData = new FormData();

        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }

        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnail", data.courseImage);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          setStep(2);
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No changes made so far");
      }

      return;
    } else {
      const formData = new FormData();

      formData.append("courseName", data.courseTitle);

      formData.append("courseDescription", data.courseShortDesc);

      formData.append("price", data.coursePrice);

      formData.append("whatYouWillLearn", data.courseBenefits);

      formData.append("category", data.courseCategory);

      formData.append("instructions", JSON.stringify(data.courseRequirement));

      formData.append("thumbnailImage", data.courseImage);

      formData.append("status", COURSE_STATUS.DRAFT);

      formData.append("tag", JSON.stringify(data.courseTags));
      console.log(JSON.stringify(data.courseTags));
      setLoading(true);

      // console.log("Print token", token);
      const result = await addCourseDetails(formData, token);

      if (result) {
        dispatch(setStep(2));
        dispatch(setCourse(result));
      }
      setLoading(false);
    }

    // create a new course
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8 "
    >
      <div>
        <label htmlFor="courseTitle">
          {" "}
          Course Title<sup>*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="w-full text-black"
        />
        {errors.courseTitle && <span>Course Title is Required</span>}
      </div>
      <div>
        <label htmlFor="courseShortDesc">
          {" "}
          Course Short Description<sup>*</sup>
        </label>

        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="w-full text-black min-h-[130px]"
        ></textarea>
        {errors.courseShortDesc && <span>Course Description is required</span>}
      </div>
      <div className="relative">
        <label htmlFor="coursePrice">
          {" "}
          Course Price<sup>*</sup>
        </label>
        <input
          id="coursePrice"
          placeholder="Enter Course Price"
          {...register("coursePrice", { required: true, valueAsNumber: true })}
          className="w-full text-black"
        />

        <FaRupeeSign className="absolute top-1/2 text-black " />
        {errors.coursePrice && <span>Course Price is Required</span>}
      </div>
      <div>
        <label htmlFor="courseCategory">
          {" "}
          Course Category<sup>*</sup>
        </label>
        <select
          id="courseCategory"
          defaultValue=""
          {...register("courseCategory", { required: true })}
        >
          <option value="" disabled>
            Choose Category
          </option>

          {!loading &&
            courseCategories.map((category, index) => (
              <option
                key={index}
                value={category?._id}
                className="text-white bg-richblack-700"
              >
                {category?.name}
              </option>
            ))}
        </select>

        {errors.courseCategory && <span>Course Categories is Required</span>}
      </div>
      {/* create a custom component for handling tags input */}
      {
        <ChipInput
          label="Tags"
          name="courseTags"
          placeholder="Enter tags and press enter"
          register={register}
          errors={errors}
          setValue={setValue}
          getValue={getValue}
        />
      }
      {/* create a component for uploading and showing preview of media */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        errors={errors}
        setValue={setValue}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}

      <div>
        <label htmlFor="courseBenefits">
          {" "}
          Benefits of the course<sup>*</sup>
        </label>

        <textarea
          id="courseBenefits"
          placeholder="Enter Benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="min-h-[130px] w-full text-black"
        />
        {errors.courseBenefits && (
          <span>Benefits of the course are required**</span>
        )}
      </div>

      <RequirementField
        name="courseRequirement"
        label="Requirements/Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValue={getValue}
      />

      <div>
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="flex items-center gap-x-2 bg-richblack-300 text-white"
          >
            Continue without Saving
          </button>
        )}

        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        />
      </div>
    </form>
  );
};

export default CourseInformationForm;
