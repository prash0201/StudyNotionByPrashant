import React from "react";
import HighlightText from "../components/core/HomePage/HighlightText";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import Quote from "../components/core/AboutPage/Quote";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponent from "../components/core/AboutPage/Stats";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import Footer from "../components/core/HomePage/Common/Footer";
import ReviewSlider from "../components/core/HomePage/Common/ReviewSlider";
const About = () => {
  return (
    <div className="mt-[100px]">
      {/* section 1 */}
      <section>
        <div>
          <header className="text-white">
            Driving Innovation in Online Education for a{" "}
            <HighlightText text={"Brighter Future"} />
            <p>
              Studynotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
            <div className="flex flex-row gap-x-3 mx-auto">
              <img src={BannerImage1} />
              <img src={BannerImage2} />
              <img src={BannerImage3} />
            </div>
          </header>
        </div>
      </section>

      {/* section 2 */}

      <section>
        <div className="text-white">
          <Quote />
        </div>
      </section>

      {/* section 3 */}

      <section>
        <div>
          {/* founding story wala box */}
          <div className="flex flex-row gap-x-5 text-white">
            {/* founding story left box */}
            <div>
              <h1>Our Founding Story</h1>

              <p>
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>

              <p>
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>
            {/* founding story right box */}
            <div>
              <img src={FoundingStory} />
            </div>
          </div>

          {/* Vision and mission wala parent div */}
          <div className="flex flex-row gap-x-5 mx-auto text-white">
            <div className="flex flex-col ">
              <h1>Our Vision</h1>
              <p>
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>
            {/* right box */}
            <div className="flex flex-col ">
              <h1>Our Vision</h1>
              <p>
                our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuals can connect, collaborate, and learn from one
                another. We believe that knowledge thrives in an environment of
                sharing and dialogue, and we foster this spirit of collaboration
                through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* section 4 */}

      <StatsComponent />

      {/* section 5 */}
      <section className="flex mx-auto flex-col items-center justify-betweengap-5 mb-10">
        <LearningGrid />
        <ContactFormSection />
      </section>

      <section>
        <h1 className="text-center text-white text-3xl">
          Reviews from other learners
        </h1>

        {/* <ReviewSlider></ReviewSlider> */}
        <ReviewSlider />
      </section>

      <Footer></Footer>
    </div>
  );
};

export default About;
