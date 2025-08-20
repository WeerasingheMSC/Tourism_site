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
    { name: 'Facebook', href: 'https://facebook.com/profile.php?id=61570804191208', bgColor: 'bg-blue-600', icon: 'facebook' },
    { name: 'Pinterest', href: '', bgColor: '', icon: 'pinterest' },
    { name: 'WhatsApp', href: '#', bgColor: 'bg-green-500', icon: 'whatsapp' },
    { name: 'Instagram', href: '#', bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: 'instagram' },
    { name: 'TikTok', href: 'https://tiktok.com/@travelbookingsrilanka', bgColor: 'bg-black', icon: 'tiktok' },
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
        return <img src={pinterest} alt="Pinterest" className="w-5 h-5 object-contain" />;
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
    <footer className="text-white py-8 sm:py-12 px-4" style={{ backgroundColor: '#263238 ' }}>
      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Left section - Brand and description */}
          <div className="md:col-span-2 lg:col-span-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-3 sm:mb-4">
              Travel Booking SriLanka
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed max-w-xs mx-auto md:mx-0">
              Book your trip in minute, get full control for much longer.
            </p>
          </div>

          {/* Middle section - Navigation links */}
          <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {footerSections.map((section, index) => (
              <div key={index} className="text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base block"
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
          <div className="md:col-span-2 lg:col-span-1 flex justify-center lg:justify-end">
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-3 lg:gap-2 max-w-xs sm:max-w-none lg:max-w-xs">
              {socialIcons.map((social, index) => {
                // Only render clickable links for valid URLs
                if (social.href === '#' || social.href === '') {
                  return (
                    <div
                      key={index}
                      className={`
                        ${social.bgColor} 
                        w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 
                        rounded-full 
                        flex items-center justify-center 
                        text-white text-xs lg:text-sm font-bold
                        shadow-lg
                        mx-auto lg:mx-0
                        opacity-50 cursor-not-allowed
                      `}
                    >
                      {renderIcon(social.icon)}
                    </div>
                  );
                }
                
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      ${social.bgColor} 
                      w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 
                      rounded-full 
                      flex items-center justify-center 
                      text-white text-xs lg:text-sm font-bold
                      hover:scale-110 transform transition-all duration-200
                      shadow-lg hover:shadow-xl
                      mx-auto lg:mx-0
                      cursor-pointer
                      pointer-events-auto
                    `}
                    aria-label={`Visit our ${social.name} page`}
                  >
                    {renderIcon(social.icon)}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-600 my-6 sm:my-8"></div>

        {/* Bottom section - Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            All rights reserved@TravelBookingSriLanka.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;