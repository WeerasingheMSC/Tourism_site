import React from "react";
import facebookIcon from "../../assets/icons/facebookicon.png";
import printerestIcon from "../../assets/icons/printeresticon.png";
import whatsappIcon from "../../assets/icons/whatsappicon.png";
import instaIcon from "../../assets/icons/instaicon.png";
import tiktokIcon from "../../assets/icons/tiktokicon.png";
import phoneIcon from "../../assets/icons/phoneicon.png";

const UpdatedFooter: React.FC = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
      {/* Left Section */}
      <div className="w-full md:w-1/2 mb-8 order-1">
        <h3 className="text-3xl font-bold text-blue-400 mb-4">
          Travel Booking SriLanka
        </h3>
        <p className="text-gray-400 max-w-md">
          Book your trip in minute, get full Control for much longer.
        </p>
      </div>
      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end gap-4 mb-8 order-2">
        <a
          href="https://www.facebook.com/share/19A7rNTzuA/"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
        </a>
        <a
          href="https://www.pinterest.com"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={printerestIcon} alt="Pinterest" className="w-6 h-6" />
        </a>
        <a
          href="https://wa.me/message/KPQH4V457I7HH1"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6" />
        </a>
        <a
          href="https://www.instagram.com/travelbookingsrilanka"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={instaIcon} alt="Instagram" className="w-6 h-6" />
        </a>
        <a
          href="https://www.tiktok.com/@travelbookingsrilanka?_t=ZS-8xDU72o7g02&_r=1"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={tiktokIcon} alt="TikTok" className="w-6 h-6" />
        </a>
        <a
          href="#"
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <img src={phoneIcon} alt="Phone" className="w-6 h-6" />
        </a>
      </div>
    </div>
    <div className="text-center text-gray-400 text-sm">
      All rights reserved@TravelBookingSrilanka.com
    </div>
  </footer>
);

export default UpdatedFooter;
