// src/components/TopSelling.jsx
import { Row, Col, Card } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import Silver from '../../assets/Sri-Lanka-tourism.jpg';
import Golden from '../../assets/demodara-bridge (1).jpg';
import Platinum from '../../assets/Sri-Lanka-Travel-Tips-Things-to-Do-in-Sri-Lanka-12.jpeg';

const destinations = [
  {
    id: 1,
    image: Silver,
    plan: 'Silver Plan',
    price: '$1.4k',
    days: '10 Days Trip',
  },
  {
    id: 2,
    image: Golden,
    plan: 'Gold Plan',
    price: '$2.2k',
    days: '12 Days Trip',
  },
  {
    id: 3,
    image: Platinum,
    plan: 'Platinum Plan',
    price: '$5k',
    days: '28 Days Trip',
  },
];

const TopSelling = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-40 mb-16">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-8">
        <h2
          className="text-gray-600 text-sm uppercase tracking-wide mb-1"
          style={{ fontFamily: 'sans-serif' }}
        >
          Top Selling
        </h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-center">
          Top Destinations
        </h1>
      </div>

      {/* Cards Row */}
      <Row gutter={[24, 24]} justify="center">
        {destinations.map((dest) => (
          <Col key={dest.id} xs={24} sm={24} md={8} lg={8} xl={8}>
            <div className="flex justify-center">
              <Card
                hoverable
                cover={
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={dest.image}
                      alt={dest.plan}
                      className="w-full object-cover h-48 sm:h-56 md:h-64 transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                }
                className="rounded-lg shadow-md border border-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                style={{ 
                  maxWidth: '320px', 
                  width: '100%' 
                }}
                bodyStyle={{ 
                  padding: '16px' 
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {dest.plan}
                  </h3>
                  <span className="text-lg font-bold text-indigo-600">
                    {dest.price}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <EnvironmentOutlined className="text-base mr-2 text-indigo-600" />
                  <span className="text-sm font-medium">{dest.days}</span>
                </div>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TopSelling;