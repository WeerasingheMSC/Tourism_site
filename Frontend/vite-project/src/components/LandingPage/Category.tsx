import Group4 from "../../assets/Group 4.png";
import Group48 from "../../assets/Group 48.png";
import Group49 from "../../assets/Group 49.png";
import Group50 from "../../assets/Group 50.png";
import Group51 from "../../assets/Group 51.png";
import Rectangle from "../../assets/Rectangle 157.png";
import { Row, Col } from "antd";

const Category = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-10 md:mt-12 mb-12 sm:mb-16 md:mb-20 relative">
      {/* Background Decoration */}
      <div className="relative">
        <img 
          src={Group4} 
          alt="" 
          className="hidden lg:flex absolute right-0 w-32 h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 z-10 
                     top-20 md:top-24  lg:top-0 lg:right-0" 
        />
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-center mt-16 sm:mt-24 md:mt-32 lg:mt-36 mb-8 sm:mb-10 md:mb-12">
        <h1
          className="text-center font-bold text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg
                     uppercase tracking-wider mb-2 sm:mb-3 md:mb-4"
          style={{ fontFamily: "unset" }}
        >
          CATEGORY
        </h1>
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                       font-serif font-semibold mt-1 sm:mt-2 
                       px-4 sm:px-6 md:px-8 
                       leading-tight sm:leading-tight md:leading-tight">
          We Offer Best Services
        </h1>
      </div>

      {/* Services Grid */}
      <Row gutter={[12, 16]} justify="center" className="relative">
        {[
          {
            img: Group48,
            title: "Travelling Partner",
            desc: "Built Wicket longer admire do barton vanity itself do in it......"
          },
          {
            img: Group51,
            title: "Best Flights",
            desc: "Engrossed listening. Park gate sell they west hard for the."
          },
          {
            img: Group50,
            title: "Hotel Partner",
            desc: "Barton vanity itself do in it. Preferd to men it engrossed listening."
          },
          {
            img: Group49,
            title: "Customization",
            desc: "We deliver outsourced aviation services for military customers."
          },
        ].map(({ img, title, desc }, idx) => (
          <Col key={idx} xs={24} sm={12} md={12} lg={6} xl={6}>
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl 
                           cursor-pointer overflow-hidden
                           mx-auto max-w-xs sm:max-w-sm md:max-w-none
                           mt-4 sm:mt-6 md:mt-8 lg:mt-12 xl:mt-40 z-10 ">
              
              {/* Card Content */}
              <div className="p-4 sm:p-5 md:p-6 text-center relative">
                {/* Icon */}
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <img 
                    src={img} 
                    alt={title} 
                    className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 
                               mx-auto object-contain" 
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 
                              mb-3 sm:mb-4 md:mb-5 
                              leading-tight">
                  {title}
                </h3>
                
                {/* Description */}
                <p className="text-xs sm:text-sm md:text-base text-gray-600 
                              leading-relaxed px-2 sm:px-3 md:px-4">
                  {desc}
                </p>
              </div>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 
                             opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </Col>
        ))}
        
        {/* Background Rectangle - Desktop Only */}
        <img 
          src={Rectangle} 
          alt="" 
          className="absolute hidden xl:flex top-100 left-65 z-0 w-24 h-24" 
        />
      </Row>
    </div>
  );
};

export default Category;