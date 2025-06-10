import React from 'react';
import { Facebook, Instagram, Phone, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* Left Side - Brand and Tagline */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
              Travel Booking SriLanka
            </h1>
            <p className="text-gray-300 text-sm">
              Book your trip in minute, get full Control for much longer.
            </p>

          </div>

          {/* Right Side - Social Media Icons */}
          <div className="flex space-x-3 mt-2 sm:mt-0">
            <a 
              href="#" 
              className="text-white hover:text-blue-300 transition-colors duration-200 p-2 bg-blue-600 rounded-full"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            
            <a 
              href="#" 
              className="text-white hover:text-blue-300 transition-colors duration-200 p-2 bg-blue-600 rounded-full"
              aria-label="Pinterest"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.372 0 12 0 17.084 3.163 21.426 7.627 23.174c-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.99-5.373 11.99-12C24 5.372 18.626.001 12.001.001z"/>
              </svg>
            </a>
            
            <a 
              href="#" 
              className="text-white hover:text-blue-300 transition-colors duration-200 p-2 bg-blue-600 rounded-full"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            
            <a 
              href="#" 
              className="text-white hover:text-blue-300 transition-colors duration-200 p-2 bg-blue-600 rounded-full"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            
            <a 
              href="#" 
              className="text-white hover:text-blue-300 transition-colors duration-200 p-2 bg-blue-600 rounded-full"
              aria-label="Phone"
            >
              <Phone className="w-4 h-4" />
            </a>
            
            <a 
              href="#" 
              className="text-white hover:text-blue-300 transition-colors duration-200 p-2 bg-blue-600 rounded-full"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-6 pt-4 text-center">
          <p className="text-gray-400 text-sm">
  All rights reserved@TravelBookingSriLanka.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

<div className="border-t border-gray-600 mt-6 pt-4 text-center">
<p className="text-gray-400 text-sm">
  All rights reserved@TravelBookingSriLanka.com
</p>
</div>