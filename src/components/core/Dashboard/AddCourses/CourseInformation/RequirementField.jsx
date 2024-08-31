import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RequirementField = ({
  name,
  label,
  register,
  setValue,
  errors,
  getValue,
}) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);
  const { editCourse, course } = useSelector((state) => state.course);
  useEffect(() => {
    if (editCourse) {
      setRequirementList(course?.instructions);
    }
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  }, []);

  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList]);

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirement = [...requirementList];
    updatedRequirement.splice(index, 1);
    setRequirementList(updatedRequirement);
  };
  return (
    <div>
      <label htmlFor={name}>
        {label} <sup>*</sup>
      </label>
      <div>
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full text-black"
        />

        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>

      {requirementList.length > 0 && (
        <ul>
          {requirementList.map((requirement, index) => (
            <li key={index} className="flex  items-center text-richblack-5">
              <span>{requirement}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="text-xs text-pure-greys-300 "
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && <span>{label} is required</span>}
    </div>
  );
};

export default RequirementField;
