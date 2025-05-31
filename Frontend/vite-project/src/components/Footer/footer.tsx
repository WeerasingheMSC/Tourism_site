import React from 'react';
import { Facebook, MessageCircle, Phone, Instagram, } from 'lucide-react';
import tiktokIcon from '../../assets/Tiktok.png';//alredy in asset folder
import pinterest from '../../assets/logos_pinterest.png'; // Assuming you have a Pinterest icon image


// Define TypeScript interfaces for better type safety
interface SocialIcon {
  name: string;
  href: string;
  bgColor: string;
  icon: string;
}
interface FooterLink {
  text: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  // Social media icons data with actual icon components
  const socialIcons: SocialIcon[] = [
    { name: 'Facebook', href: '#', bgColor: 'bg-blue-600', icon: 'facebook' },
    { name: 'Pinterest', href: '#', bgColor: '', icon: 'pinterest' },
    { name: 'WhatsApp', href: '#', bgColor: 'bg-green-500', icon: 'whatsapp' },
    { name: 'Instagram', href: '#', bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: 'instagram' },
    { name: 'TikTok', href: '#', bgColor: 'bg-black', icon: 'tiktok' },
    { name: 'Phone', href: '#', bgColor: 'bg-gray-600', icon: 'phone' },
  ];

  // Function to render the appropriate icon
  const renderIcon = (iconType: string) => {
    const iconProps = { size: 20, className: "text-white" };
    
    switch (iconType) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'whatsapp':
        return <MessageCircle {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'phone':
        return <Phone {...iconProps} />;
      case 'pinterest':
        return <img src={pinterest} alt="TikTok" className="w-5 h-5 object-contain" />;
      case 'tiktok':
        return <img src={tiktokIcon} alt="TikTok" className="w-5 h-5 object-contain" />;
      default:
        return <div className="text-white">?</div>;
    }
  };

  // Footer navigation sections
  const footerSections: FooterSection[] = [
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: '/about' },
        { text: 'Reviews', href: '/review' },
        { text: 'Plans', href: '/palns' },
        { text: 'Custom Packages', href: '/custom_package' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { text: 'Help/FAQ', href: '/help' },
        { text: 'Press', href: '/press' },
        { text: 'Publish Ads', href: '/publish_ads' },
      ],
    },
  ];

  return (
    <footer className=" text-white py-12 px-4" style={{ backgroundColor: '#263238 ' }}>
      <div className="max-w-6xl mx-auto">
        {/* Main footer content with social icons in top-right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left section - Brand and description */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-blue-400 mb-4">
              Travel Booking SriLanka
            </h2>
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
              Book your trip in minute, get full control for much longer.
            </p>
          </div>

          {/* Middle section - Navigation links */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm lg:text-base"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right section - Social media icons */}
          <div className="lg:col-span-1 flex justify-center lg:justify-end">
            <div className="grid grid-cols-3 gap-3 lg:gap-2">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`
                    ${social.bgColor} 
                    w-10 h-10 lg:w-12 lg:h-12 
                    rounded-full 
                    flex items-center justify-center 
                    text-white text-xs lg:text-sm font-bold
                    hover:scale-110 transform transition-all duration-200
                    shadow-lg hover:shadow-xl
                  `}
                  aria-label={social.name}
                >
                  {renderIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-600 my-8"></div>

        {/* Bottom section - Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs lg:text-sm">
            All rights reserved@TravelBookingSriLanka.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;