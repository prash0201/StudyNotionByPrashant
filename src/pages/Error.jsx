import React, { useEffect, useState } from "react";

const Error = () => {
  const [enrolledCourses, setEnrolledCourses] = useState("Hello");

  const getEnrolledCourses = async () => {
    try {
      // const response = await getUserEnrolledCourses(token);
      setEnrolledCourses("Hii Hello everyone");
      console.log("Print enrolled", enrolledCourses);
    } catch (error) {
      console.log("Unable to Fetch enrolled Courses");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);
  return (
    <div className="flex justify-center items-center text-3xl text-white">
      Error - 404 Not Found
      <p>{enrolledCourses}</p>
    </div>
  );
};

export default Error;
