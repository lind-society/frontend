import * as React from "react";

import { useLocation } from "react-router-dom";

import { useMediaQuery } from "../../hooks";

import { Toaster } from "react-hot-toast";

import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const isTabletMid = useMediaQuery("(max-width: 1024px)");

  const [openNav, setOpenNav] = React.useState<boolean>(isTabletMid ? false : true);

  const { pathname } = useLocation();

  React.useEffect(() => {
    if (isTabletMid) setOpenNav(false);
    else setOpenNav(true);
  }, [isTabletMid, pathname]);

  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen">
  //         <div className="loader"></div>
  //       </div>
  //     );
  //   }

  //   if (error) {
  //     return;
  //   }

  return (
    <div className="relative flex bg-light">
      <Toaster position="top-center" />
      <div onClick={() => setOpenNav(false)} className={`lg:hidden fixed inset-0 h-screen z-100 bg-dark/50 ${openNav ? "block" : "hidden"}`} />
      <Sidebar openNav={openNav} isTabletMid={isTabletMid} />
      <div className="flex-1 w-full duration-300 lg:pl-64">
        <TopBar
          setOpenNav={setOpenNav}
          data={{
            username: "username",
            email: "test@example.com",
          }}
        />
        <div className="w-full duration-300 text-primary">
          <div className="w-full min-h-screen p-2 sm:p-4 bg-gray">
            <div className="p-2 sm:p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
