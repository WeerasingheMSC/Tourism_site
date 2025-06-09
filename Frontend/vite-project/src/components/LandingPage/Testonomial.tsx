import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Space } from 'antd';
import { LeftOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Mike Taylor",
      location: "Lahore, Pakistan", 
      title: "Travel Enthusiast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote: "On the Windows talking painted pasture yet its express parties use. Sure last upon he same as knew next. Of believed or diverted no.",
      rating: 5
    },
    {
      id: 2,
      name: "Chris Thomas",
      location: "New York, USA",
      title: "CEO of Red Button", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      quote: "Amazing experience! The service was exceptional and the trip was perfectly organized. Would definitely recommend to anyone looking for a memorable vacation.",
      rating: 5
    },
    {
      id: 3,
      name: "Sarah Johnson",
      location: "London, UK",
      title: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face", 
      quote: "Professional service with attention to detail. Every aspect of our journey was carefully planned and executed. Truly a world-class travel experience.",
      rating: 5
    },
    {
      id: 4,
      name: "David Kim",
      location: "Seoul, South Korea",
      title: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote: "The best travel booking platform I've ever used. Seamless experience from booking to the actual trip. Customer support was outstanding throughout.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentData = testimonials[currentTestimonial];

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f5 100%)',
        padding: '0px 20px',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[60, 40]} align="middle" style={{ minHeight: '600px' }}>
          
          {/* Left Side - Content */}
          <Col xs={24} lg={12} style={{ textAlign: 'center' }} className="lg:text-left">
            <div style={{ marginBottom: '40px' }}>
              <Text 
                style={{ 
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#5E6282',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  display: 'block',
                  marginBottom: '20px'
                }}
              >
                TESTIMONIALS
              </Text>
              <Title 
                level={1} 
                style={{ 
                  fontSize: '50px',
                  fontWeight: 700,
                  lineHeight: '1.2',
                  color: '#14183E',
                  marginBottom: '0'
                }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              >
                What People Say<br />
                About Us.
              </Title>
            </div>

            {/* Navigation Dots */}
            <Space size="middle" style={{ marginTop: '40px' }}>
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  style={{
                    width: index === currentTestimonial ? '30px' : '12px',
                    height: '12px',
                    borderRadius: '6px',
                    background: index === currentTestimonial ? '#DF6951' : '#E5E5E5',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: index === currentTestimonial ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              ))}
            </Space>
          </Col>

          {/* Right Side - Testimonial Card */}
          <Col xs={24} lg={12}>
            <div style={{ position: 'relative' }}>
              
              {/* Navigation Arrows - Desktop */}
              <Button
                onClick={prevTestimonial}
                shape="circle"
                size="large"
                icon={<LeftOutlined />}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-60px',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  border: '2px solid #DF6951',
                  color: '#DF6951',
                  background: 'white',
                  width: '48px',
                  height: '48px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'none'
                }}
                className="hidden lg:flex lg:items-center lg:justify-center"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#DF6951';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#DF6951';
                }}
              />

              <Button
                onClick={nextTestimonial}
                shape="circle"
                size="large"
                icon={<RightOutlined />}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-60px',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  border: '2px solid #DF6951',
                  color: '#DF6951',
                  background: 'white',
                  width: '48px',
                  height: '48px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'none'
                }}
                className="hidden lg:flex lg:items-center lg:justify-center"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#DF6951';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#DF6951';
                }}
              />

              {/* Mobile Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }} className="lg:hidden">
                <Button
                  onClick={prevTestimonial}
                  shape="circle"
                  icon={<LeftOutlined />}
                  style={{
                    border: '2px solid #DF6951',
                    color: '#DF6951',
                    background: 'white'
                  }}
                />
                <Button
                  onClick={nextTestimonial}
                  shape="circle"
                  icon={<RightOutlined />}
                  style={{
                    border: '2px solid #DF6951',
                    color: '#DF6951',
                    background: 'white'
                  }}
                />
              </div>

              {/* Testimonial Card */}
              <Card
                style={{
                  borderRadius: '24px',
                  border: 'none',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  background: 'white',
                  minHeight: '400px',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{
                  padding: '40px',
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                className="hover:shadow-2xl"
              >
                {/* Avatar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <Avatar
                    size={80}
                    src={currentData.avatar}
                    icon={<UserOutlined />}
                    style={{
                      border: '4px solid #f0f0f0',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}
                  />
                </div>

                {/* Quote */}
                <div style={{ flex: 1, marginBottom: '30px', position: 'relative' }}>
                  <span 
                    style={{
                      fontSize: '40px',
                      color: '#DF6951',
                      position: 'absolute',
                      top: '-10px',
                      left: '-20px',
                      fontFamily: 'serif'
                    }}
                  >
                    "
                  </span>
                  <Paragraph
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.8',
                      color: '#5E6282',
                      fontStyle: 'italic',
                      marginBottom: 0,
                      paddingLeft: '20px',
                      paddingRight: '20px'
                    }}
                  >
                    {currentData.quote}
                  </Paragraph>
                  <span 
                    style={{
                      fontSize: '40px',
                      color: '#DF6951',
                      fontFamily: 'serif'
                    }}
                  >
                    "
                  </span>
                </div>

                {/* User Info */}
                <div>
                  <Title
                    level={4}
                    style={{
                      color: '#14183E',
                      marginBottom: '4px',
                      fontSize: '18px',
                      fontWeight: 600
                    }}
                  >
                    {currentData.name}
                  </Title>
                  <Text
                    style={{
                      color: '#84829A',
                      fontSize: '14px',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    {currentData.location}
                  </Text>
                  <Text
                    style={{
                      color: '#5E6282',
                      fontSize: '13px',
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: '12px'
                    }}
                  >
                    {currentData.title}
                  </Text>

                  {/* Star Rating */}
                  <div>
                    {[...Array(currentData.rating)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: '#FFD700',
                          fontSize: '16px',
                          marginRight: '2px'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Progress Indicator */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  color: '#5E6282',
                  fontWeight: 500
                }}
              >
                {currentTestimonial + 1} / {testimonials.length}
              </div>
            </div>
          </Col>
        </Row>

        {/* Mobile Dots - Alternative Position */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '40px' }} className="lg:hidden">
          {testimonials.map((_, index) => (
            <div
              key={index}
              onClick={() => goToTestimonial(index)}
              style={{
                width: index === currentTestimonial ? '32px' : '12px',
                height: '12px',
                borderRadius: '6px',
                background: index === currentTestimonial ? '#DF6951' : '#E5E5E5',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(223, 105, 81, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 1
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(94, 98, 130, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 1
        }}
      />
    </div>
  );
};

export default TestimonialsSection;