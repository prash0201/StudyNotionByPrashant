import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/core/HomePage/Common/Footer";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import getCatalogPageData from "../services/operations/pageAndComponentData";
import CoursesSlider from "../components/core/Catalog/CoursesSlider";
import Course_Card from "../components/core/Catalog/Course_Card";
const Catalog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // Fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      console.log("GetCategoryDetails", res);
      const category_id = res?.data?.data?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]._id;

      setCategoryId(category_id);
    };
    getCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogPageData(categoryId);

        // console.log("Catalog details batao", res);
        setCatalogPageData(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);
  return (
    <div className="text-white">
      <div>
        <p>
          {`Home / Catalog`}
          <span>{catalogPageData?.data?.selectedCategory?.name}</span>
        </p>
        <p> {catalogPageData?.data?.selectedCategory?.name}</p>
        <p> {catalogPageData?.data?.selectedCategory?.description}</p>
      </div>

      <div>
        {/* Section 1 */}
        <div>
          <div>Courses to get you started</div>
          <div className="flex gap-x-3">
            <p>Most Popular </p>
            <p>New</p>
          </div>

          <div>
            <CoursesSlider
              Courses={catalogPageData?.data?.selectedCategory?.courses}
            />
          </div>
        </div>

        {/* Section 2 */}

        <div>
          <div>
            Top Courses in {catalogPageData?.data?.selectedCategory?.name}
          </div>
          <div>
            {" "}
            <CoursesSlider
              Courses={catalogPageData?.data?.differentCategory?.courses}
            />
          </div>
        </div>

        {/* section 3 */}
        <div>
          <div>Frequently Bought</div>

          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {catalogPageData?.data?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, index) => (
                  <Course_Card
                    course={course}
                    key={index}
                    Height={"h-[400px]"}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
