import React, { useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../HomePage/Common/IconBtn";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import NestedView from "./NestedView";

import {
  setEditCourse,
  setStep,
  setCourse,
} from "../../../../../slices/courseSlice";
// import { updateSection } from "../../../../../services/operations/courseDetailsAPI";
// import { createSection } from "../../../../../../server/controllers/Section";

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";

const CourseBuilderForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [editSectionName, setEditSectionName] = useState(null);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const onSubmit = async (data) => {
    setLoading(true);
    let result;
    if (editSectionName) {
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName,
        courseId: course._id,
      });
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }

    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  const goToNext = () => {
    if (course?.courseContent?.length === 0) {
      toast.error("Please add atleast one Section");
      return;
    }

    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one Lecture in each section");
      return;
    }
    dispatch(setStep(3));
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };
  return (
    <div className="text-white">
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="sectionName">Section name</label>
          <input
            id="sectionName"
            placeholder="Add section name"
            {...register("sectionName", { required: true })}
          />
        </div>

        <div className="m-10 flex flex-row">
          <IconBtn
            type="submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            customClasses={"text-white bg-yellow-500"}
          >
            <CiCirclePlus size={20} />
          </IconBtn>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline ml-10"
            >
              Cancel Edit{" "}
            </button>
          )}
        </div>
      </form>

      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}
      {/* <NestedView handleChangeEditSectionName={handleChangeEditSectionName} /> */}
      <div className="flex justify-end gap-x-3 mt-5 ">
        <button
          type="submit"
          onClick={goBack}
          className="rounded-md cursor-pointer flex items-center"
        >
          {" "}
          Back
        </button>
        <IconBtn text="Next" onClick={goToNext}>
          <FaRegArrowAltCircleRight />
        </IconBtn>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
