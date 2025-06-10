import React, { useState } from 'react';
import { Card, Row, Col, Typography, Space, Button, Progress, Avatar } from 'antd';
import { 
  EnvironmentOutlined, 
  CreditCardOutlined, 
  CarOutlined,
  HeartOutlined,
  ShareAltOutlined,
  BookOutlined,
  SendOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const TravelBookingSection = () => {
  const [likedTrips, setLikedTrips] = useState(new Set());

  const toggleLike = (tripId: string) => {
    const newLikedTrips = new Set(likedTrips);
    if (newLikedTrips.has(tripId)) {
      newLikedTrips.delete(tripId);
    } else {
      newLikedTrips.add(tripId);
    }
    setLikedTrips(newLikedTrips);
  };

  const steps = [
    {
      icon: <EnvironmentOutlined />,
      title: "Choose Destination",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
      color: "#FF9500",
      bgColor: "rgba(255, 149, 0, 0.1)"
    },
    {
      icon: <CreditCardOutlined />,
      title: "Make Payment", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
      color: "#F15A2B",
      bgColor: "rgba(241, 90, 43, 0.1)"
    },
    {
      icon: <CarOutlined />,
      title: "Reach Airport on Selected Date",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.",
      color: "#006A6B",
      bgColor: "rgba(0, 106, 107, 0.1)"
    }
  ];

  return (
    <div style={{
      padding: '80px 40px',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f5 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[60, 40]} align="middle">
          {/* Left Side - Steps */}
          <Col xs={24} lg={12}>
            <div style={{ marginBottom: '40px' }}>
              <Text 
                style={{ 
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#DF6951',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}
              >
                Easy and Fast
              </Text>
              <Title 
                level={1} 
                style={{ 
                  fontSize: '50px',
                  fontWeight: 700,
                  lineHeight: '1.2',
                  color: '#14183E',
                  marginTop: '20px',
                  marginBottom: '50px'
                }}
              >
                Book Your Next Trip<br />
                In 3 Easy Steps
              </Title>
            </div>

            <Space direction="vertical" size={40} style={{ width: '100%' }}>
              {steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    background: step.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.color,
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title 
                      level={4} 
                      style={{ 
                        color: '#5E6282',
                        fontWeight: 700,
                        marginBottom: '8px',
                        fontSize: '16px'
                      }}
                    >
                      {step.title}
                    </Title>
                    <Paragraph 
                      style={{ 
                        color: '#5E6282',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        margin: 0
                      }}
                    >
                      {step.description}
                    </Paragraph>
                  </div>
                </div>
              ))}
            </Space>
          </Col>

          {/* Right Side - Trip Cards */}
          <Col xs={24} lg={12}>
            <div style={{ position: 'relative' }}>
              {/* Main Trip Card */}
              <Card
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: 'none',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  background: 'white'
                }}
                bodyStyle={{ padding: '0' }}
              >
                <div style={{
                  height: '320px',
                  backgroundImage: 'url("https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)'
                  }} />
                </div>
                
                <div style={{ padding: '24px' }}>
                  <Title 
                    level={3} 
                    style={{ 
                      color: '#080809',
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}
                  >
                    Trip To Greece
                  </Title>
                  
                  <Text style={{ color: '#84829A', fontSize: '14px' }}>
                    14-29 June | by Robbin jo
                  </Text>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '16px'
                  }}>
                    <Space size={16}>
                      <Button 
                        type="text" 
                        icon={<EnvironmentOutlined />}
                        style={{ 
                          background: '#F5F5F5',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                      <Button 
                        type="text" 
                        icon={<BookOutlined />}
                        style={{ 
                          background: '#F5F5F5',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                      <Button 
                        type="text" 
                        icon={<SendOutlined />}
                        style={{ 
                          background: '#F5F5F5',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                    </Space>
                    
                    <Button
                      type="text"
                      icon={<HeartOutlined />}
                      onClick={() => toggleLike('greece')}
                      style={{
                        color: likedTrips.has('greece') ? '#FF6B6B' : '#84829A',
                        fontSize: '18px',
                        background: 'none',
                        border: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginTop: '16px'
                  }}>
                    <TeamOutlined style={{ color: '#84829A' }} />
                    <Text style={{ color: '#84829A', fontSize: '14px' }}>
                      24 people going
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Floating Rome Trip Card */}
              <Card
                style={{
                  position: 'absolute',
                  bottom: '-40px',
                  right: '-60px',
                  width: '240px',
                  borderRadius: '18px',
                  border: 'none',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                  background: 'white',
                  zIndex: 2
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundImage: 'url("https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div>
                    <Text 
                      style={{ 
                        color: '#84829A',
                        fontSize: '12px',
                        display: 'block'
                      }}
                    >
                      Ongoing
                    </Text>
                    <Title 
                      level={5} 
                      style={{ 
                        color: '#080809',
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: 600
                      }}
                    >
                      Trip to rome
                    </Title>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <Text 
                    style={{ 
                      color: '#8A79DF',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    40% completed
                  </Text>
                </div>
                
                <Progress 
                  percent={40} 
                  strokeColor="#8A79DF"
                  trailColor="#F5F5F5"
                  strokeWidth={6}
                  showInfo={false}
                  style={{ marginBottom: '0' }}
                />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TravelBookingSection;