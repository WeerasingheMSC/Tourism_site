import React from "react";
import Group4 from "../../assets/Group 4.png";
import Group48 from "../../assets/Group 48.png";
import Group49 from "../../assets/Group 49.png";
import Group50 from "../../assets/Group 50.png";
import Group51 from "../../assets/Group 51.png";
import { Row, Col } from "antd";

const Category = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 mt-12">
      <div className="relative">
        <img src={Group4} alt="" className="hidden md:flex absolute right-0 w-40 h-50 md:w-52 md:h-52 z-10" />
      </div>

      <div className="flex flex-col items-center mt-36 mb-12">
        <h1
          className="text-center font-bold text-gray-700 text-sm md:text-md "
          style={{ fontFamily: "unset" }}
        >
          CATEGORY
        </h1>
        <h1 className="text-center text-2xl md:text-5xl font-serif font-semibold mt-2">
          We offer best service
        </h1>
      </div>

      <Row gutter={[16, 24]} justify="center">
        {[ 
          { img: Group48, title: "Travelling Partner", desc: "Built Wicket longer admire do barton vanity itself do in it." },
          { img: Group51, title: "Best Flights", desc: "Built Wicket longer admire do barton vanity itself do in it." },
          { img: Group50, title: "Hotel Partner", desc: "Built Wicket longer admire do barton vanity itself do in it." },
          { img: Group49, title: "Customization", desc: "Built Wicket longer admire do barton vanity itself do in it." },
        ].map(({ img, title, desc }, idx) => (
          <Col key={idx} xs={24} sm={12} md={8} lg={6}>
            <div
              className="relative bg-white p-6 md:mt-40 mt-2 w-100 ml-1 w-fit md:w-full rounded-xl shadow-lg border-2 border-amber-50 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
              style={{ borderRadius: "10%" }}
            >
             
              <div>
                 <img src={img} alt={title} className="w-20 h-20 md:w-24 md:h-24 mt-1 mx-auto" />
                <p className="absolute text-md font-sans font-extrabold left-6 top-30 md:top-35 ml-33 md:ml-17 text-gray-900">
                  {title} 
                </p>
                
                <p className="text-sm mt-10 text-gray-600">{desc}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Category;
