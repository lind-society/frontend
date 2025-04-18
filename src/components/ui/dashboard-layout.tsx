import * as React from "react";

import { useGetApiWithAuth, useMediaQuery } from "../../hooks";

import { Toaster } from "react-hot-toast";

import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

import { motion, Variants } from "framer-motion";

import { Payload } from "../../types";

interface UserData {
  username: string;
  email: string;
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const isTabletMid = useMediaQuery("(max-width: 1024px)");

  const [openNav, setOpenNav] = React.useState<boolean>(true);

  const { data } = useGetApiWithAuth<Payload<UserData>>({ key: ["profile"], url: `admins/profile` });

  const containerVariants: Variants = {
    open: {
      paddingLeft: "16rem",
      transition: { damping: 40 },
    },
    closed: {
      paddingLeft: "0rem",
      transition: { damping: 40, delay: 0.15 },
    },
  };

  React.useEffect(() => {
    if (isTabletMid) setOpenNav(false);
    else setOpenNav(true);
  }, [isTabletMid]);

  return (
    <div className="relative flex bg-light">
      <Toaster position="bottom-center" containerClassName="!z-max" />
      <Sidebar openNav={openNav} />
      <motion.div className="flex-1 w-full" variants={containerVariants} animate={openNav ? "open" : "closed"} initial={false}>
        <TopBar setOpenNav={setOpenNav} data={data?.data} />
        <div className="w-full duration-300 text-primary">
          <div className="w-full min-h-screen p-2 sm:p-4 bg-gray">
            <div className="p-2 sm:p-4">{children}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
