import React from 'react';
import ContactDisplay from '../ContactDisplay';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-20"> {/* Add padding top to account for navbar */}
      <ContactDisplay />
    </div>
  );
};

export default ContactPage;
