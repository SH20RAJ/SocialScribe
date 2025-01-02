import Sidebar from "@/components/Explore/Sidebar";
import Nav from "@/components/NavBar";
import React from "react";

export default function layout({ children }) {
  return (
    <div>
      <Nav />
      <main>
        <div className="flex">
          {/* sidebar and container */}
          <div className="hidden lg:flex w-1/4">
            {/* sidebar */}
            <Sidebar />
          </div>

          <div className="w-3/4 flex flex-col gap-4 ">
            {/* container */}
            <div className="p-4">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
