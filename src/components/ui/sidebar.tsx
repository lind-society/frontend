import { motion, Variants } from "framer-motion";

import { Img } from "../../components";

import { Link, useLocation } from "react-router-dom";
import { sideBarMenu } from "../../static";

export const Sidebar = ({ openNav }: { openNav: boolean }) => {
  const { pathname } = useLocation();

  const animation: Variants = {
    open: { x: 0, width: "16rem", transition: { damping: 40 } },
    closed: { x: -256, width: 0, transition: { damping: 40, delay: 0.15 } },
  };

  return (
    <motion.aside variants={animation} animate={openNav ? "open" : "closed"} className="fixed h-screen py-6 space-y-8 overflow-auto text-center min-w-64 bg-primary text-light z-10000">
      <div className="mx-2 space-y-8">
        <Img className="mx-auto h-14 min-w-28 max-w-28" src="/logo-light.png" alt="logo lind society" />
        <span className="block text-2xl font-semibold text-light">Dashboard</span>
      </div>
      <ul className="space-y-4">
        {sideBarMenu.map((item, index) => {
          const isActive = pathname.includes(item.link);
          return (
            <div className="w-full px-4" key={index}>
              <span className={`sidebar-menu group ${isActive ? "bg-light shadow-sm" : "bg-transparent"}`}>
                <Link to={`/dashboard${item.link}`} className="block w-full">
                  <p className={`text-sm group-hover:text-primary ${isActive ? "font-semibold text-primary" : "text-light/90"}`}>{item.title}</p>
                </Link>
              </span>
            </div>
          );
        })}
      </ul>
    </motion.aside>
  );
};
