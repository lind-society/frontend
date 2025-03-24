import * as React from "react";

import { authentication, useToggleState } from "../../hooks";

import { Button, Img } from "../../components";

import { IoIosArrowDown, IoMdMenu, IoMdSearch } from "react-icons/io";

interface UserTypes {
  username: string;
  email: string;
}

export const TopBar = ({ setOpenNav, data }: { setOpenNav: React.Dispatch<React.SetStateAction<boolean>>; data: UserTypes | undefined }) => {
  const [ref, dropdown, toggleDropdown] = useToggleState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await authentication.logout();
  };

  return (
    <div className="sticky top-0 block w-full duration-300 border-b z-10000 bg-light">
      <div className="flex justify-between p-2 mx-6">
        <div className="flex gap-4 lg:hidden">
          <button className="z-20 text-primary" onClick={() => setOpenNav((prev) => !prev)}>
            <IoMdMenu size={28} />
          </button>
        </div>

        <div className="flex items-stretch w-full max-w-md overflow-hidden border rounded border-dark/20">
          <input type="text" placeholder="Search by villa, property, or activity name" className="flex-1 px-4 py-2 text-dark placeholder-dark/30 focus:outline-none" />
          <button className="flex items-center justify-center h-full text-light bg-primary w-14">
            <IoMdSearch size={25} />
          </button>
        </div>

        <div ref={ref} className="relative flex gap-4">
          <div className="flex items-center gap-2 cursor-pointer text-dark" onClick={toggleDropdown}>
            <Img src="/logo.png" className="border rounded-full size-8 sm:size-10 border-gray/50" alt="user-profile" />
            <div className="mr-1">
              <p className="text-sm font-semibold sm:text-base">{data?.username}</p>
              <p className="text-xs tracking-tight sm:text-sm">{data?.email}</p>
            </div>
            <p className={`duration-300 ${dropdown && "rotate-180"}`}>
              <IoIosArrowDown />
            </p>
          </div>
          {dropdown && (
            <div className="w-full popover top-14">
              <Button onClick={handleLogout} className={`btn-primary w-full`}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
