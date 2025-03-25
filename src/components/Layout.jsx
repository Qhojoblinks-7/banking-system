import { useState } from "react";
import DesktopSidebar from "./userdashboard/UserDashboard";
import MobileSidebar from "./userdashboard/MobileSidebar";
import Header from "./Header";

const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <Header toggleMobileSidebar={toggleMobileSidebar} />

      {/* MAIN WRAPPER */}
      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block w-64">
          <DesktopSidebar />
        </div>

        {/* MOBILE SIDEBAR (overlays content when open) */}
        {mobileSidebarOpen && (
          <MobileSidebar toggleMobileSidebar={toggleMobileSidebar} />
        )}

        {/* MAIN CONTENT AREA */}
        {/* The margin-left on md screens ensures the content doesn't get overlapped by the sidebar */}
        <div className="flex-1 p-4 md:ml-64">
          {/* Your page content here */}
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p>Lorem ipsum dolor sit amet...</p>
        </div>
      </div>
    </div>
  );
};

export default Layout;
