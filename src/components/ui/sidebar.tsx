import { motion, Variants } from "framer-motion";

import { Img } from "../../components";

import { Link, useLocation } from "react-router-dom";
import { sideBarMenu } from "../../static";

interface SidebarProps {
  openNav: boolean;
  isTabletMid: boolean;
}

export const Sidebar = ({ openNav, isTabletMid }: SidebarProps) => {
  const { pathname } = useLocation();

  const animation: Variants = {
    open: { x: 0, width: "18rem", transition: { damping: 40 } },
    closed: { x: -288, width: 0, transition: { damping: 40, delay: 0.15 } },
  };

  return (
    <motion.aside
      variants={isTabletMid ? animation : undefined}
      animate={openNav ? "open" : "closed"}
      className="fixed h-screen py-4 space-y-8 overflow-auto text-center min-w-72 bg-primary text-light z-10000"
    >
      <div className="mx-2 space-y-8">
        <Img className="mx-auto h-14 min-w-28 max-w-28" src="/logo.png" alt="logo lind society" />
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      <ul className="space-y-4">
        {sideBarMenu.map((item, index) => {
          const isActive = pathname.includes(item.link);
          return (
            <div className="w-full px-4" key={index}>
              <span className={`sidebar-menu group ${isActive ? "bg-light" : "bg-primary"}`}>
                <Link to={`/dashboard${item.link}`} className="block">
                  <span className={`absolute top-0 left-0 w-1 h-full bg-secondary group-hover:block ${isActive ? "block" : "hidden"}`}></span>
                  <p className={`font-medium group-hover:text-primary ${isActive ? "text-primary" : "text-light"}`}>{item.title}</p>
                </Link>
              </span>
            </div>
          );
        })}
      </ul>
    </motion.aside>
  );
};
