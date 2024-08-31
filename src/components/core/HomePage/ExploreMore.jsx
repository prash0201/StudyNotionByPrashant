import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";

const tabName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((courses) => courses.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div>
      <div className="font-semibold text-4xl  text-center ">
        Unlock the <HighlightText text={"Power of Code"}></HighlightText>
      </div>
      <p className="text-center text-richblack-300 text-[16px] mt-3">
        Learn to build anything you can imagine
      </p>

      <div className="mt-5 flex flex-row rounded-full bg-richblue-800 border-richblack-25 p-1 mb-5 h-[65px]">
        {tabName.map((element, index) => {
          return (
            <div
              className={`text-[16px] flex flex-row items-center gap-2 ${
                currentTab === element
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200 "
              } rounded-full transition-all duration-200 cursor-pointer hover:bg-richblue-900 hover:text-richblack-5 px-5 py-7`}
              key={index}
              onClick={() => setMyCards(element)}
            >
              {element}
            </div>
          );
        })}
      </div>

      <div className="lg:h-[150px]"></div>

      {/* Course card ka group */}

      <div className="absolute flex flex-row gap-10 justify-between w-full">
        {/* {courses.map((element, index) => {
          return (
            // <CourseCard
            //   key={index}
            //   cardData={element}
            //   currentCard={currentCard}
            //   setCurrentCard={setCurrentCard}
            // ></CourseCard>
          );
        })} */}
      </div>
    </div>
  );
};

export default ExploreMore;
