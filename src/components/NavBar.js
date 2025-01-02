import React from "react";
import Link from "next/link";

const Nav = () => {
  const isLoggedIn = true; // Use a boolean instead of an integer
  return (
    <nav className="flex justify-center items-center p-4 bg-white border-b-2">
      <div className="flex items-center space-x-2 text-black">
        <Link href="/">
          <div className="text-xl font-bold text-black">Multiversal Writer</div>
        </Link>
        <span>|</span>
        <Link href="/explore" className="hover:underline">
          Explore
        </Link>
      </div>
      <div className="ml-auto flex items-center space-x-2 text-black">
        {
          !isLoggedIn ? (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <span>|</span>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          ) : (
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
          )
        }
      </div>
    </nav>
  );
};

export default Nav;