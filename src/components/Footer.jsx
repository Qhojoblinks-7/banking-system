import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-teal-900 h-36 text-white text-center p-4">
      <p>&copy; {new Date().getFullYear()} User Dashboard. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
