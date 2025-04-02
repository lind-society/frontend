import * as React from "react";

import { useLocation } from "react-router-dom";

import { useGetApiWithAuth, useMediaQuery } from "../../hooks";

import { Toaster } from "react-hot-toast";

import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { Payload } from "../../types";

interface UserData {
  username: string;
  email: string;
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const isTabletMid = useMediaQuery("(max-width: 1024px)");

  const [openNav, setOpenNav] = React.useState<boolean>(isTabletMid ? false : true);

  const { data } = useGetApiWithAuth<Payload<UserData>>({ key: ["profile"], url: `admins/profile` });

  const { pathname } = useLocation();

  React.useEffect(() => {
    if (isTabletMid) setOpenNav(false);
    else setOpenNav(true);
  }, [isTabletMid, pathname]);

  return (
    <div className="relative flex bg-light">
      <Toaster position="bottom-center" containerClassName="!z-max" />
      <div onClick={() => setOpenNav(false)} className={`lg:hidden fixed inset-0 h-screen z-10000 bg-dark/50 ${openNav ? "block" : "hidden"}`} />
      <Sidebar openNav={openNav} isTabletMid={isTabletMid} />
      <div className="flex-1 w-full duration-300 lg:pl-72">
        <TopBar setOpenNav={setOpenNav} data={data?.data} />
        <div className="w-full duration-300 text-primary">
          <div className="w-full min-h-screen p-2 sm:p-4 bg-gray">
            <div className="p-2 sm:p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
