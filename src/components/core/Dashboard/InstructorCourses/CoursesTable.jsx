import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../HomePage/Common/ConfirmationModal";
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../slices/courseSlice";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from "react-router-dom";

const CoursesTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);

    console.log("Print after delete", result);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <div className="text-white">
      console.log(courses);
      <Table>
        <Thead>
          <Tr>
            <Th>Courses</Th>
            <Th>Duration</Th>

            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td>No Courses Found</Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-richblack-800 p-8"
              >
                <Td className="flex gap-x-4">
                  <img
                    src={course?.thumbnail}
                    className="h-[150px] w-[220px] rounded-lg object-cover"
                  />

                  <div>
                    <p>{course.courseName}</p>
                    <p>{course.courseDescription}</p>
                    <p>Created : </p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="text-pink-100">DRAFTED</p>
                    ) : (
                      <p className="text-yellow-100">PUBLISHED</p>
                    )}
                  </div>
                </Td>

                <Td>2 hrs 30 min</Td>
                <Td>${course.price}</Td>
                <Td>
                  <button
                    disabled={loading}
                    onClick={() =>
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => {
                      console.log("Click ");
                      setConfirmationModal({
                        text1: "Do you want to delete this course",
                        text2: "All the data to this course will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                  >
                    Delete
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CoursesTable;
