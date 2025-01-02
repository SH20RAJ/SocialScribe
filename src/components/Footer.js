import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center p-4 bg-white">
      <div className="flex space-x-4">
        <Link href="/privacy" className="hover:underline text-black">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline text-black">
          Terms of Service
        </Link>
        <Link href="/contact" className="hover:underline text-black">
          Contact
        </Link>
      </div>
      <div className="text-center text-black mt-4">
        <p>© 2024 Multiversal.blog</p>
      </div>
    </footer>
  );
};

export default Footer;
