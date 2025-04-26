import * as React from "react";

import { authentication, useGetApiWithAuth, useToggleState } from "../../hooks";

import { Button, Img } from "../../components";

import { IoIosArrowDown, IoMdMenu, IoMdSearch } from "react-icons/io";

import { Payload, User } from "../../types";

export const TopBar = ({ setOpenNav }: { setOpenNav: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [ref, dropdown, toggleDropdown] = useToggleState(false);

  const { data } = useGetApiWithAuth<Payload<User>>({ key: ["profile"], url: `/admins/profile` });

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await authentication.logout();
    setLoading(false);
  };

  return (
    <div className="sticky top-0 block w-full duration-300 border-b z-9999 bg-light">
      <div className="flex justify-between p-2 mx-6">
        <div className="flex w-full gap-4">
          <button className="z-20 text-primary" onClick={() => setOpenNav((prev) => !prev)}>
            <IoMdMenu size={28} />
          </button>
          <div className="flex w-full max-w-md">
            <input type="text" placeholder="Search by villa, property, or activity name" className="input-text !rounded-e-none" />
            <button className="flex items-center justify-center w-12 text-light bg-primary rounded-e">
              <IoMdSearch size={25} />
            </button>
          </div>
        </div>

        <div ref={ref} className="relative flex gap-4">
          <div className="flex items-center gap-2 cursor-pointer text-dark" onClick={toggleDropdown}>
            <Img src="/logo.png" className="border rounded-full size-8 sm:size-10 border-gray/50" alt="user-profile" />
            <div className="mr-1">
              <p className="text-sm font-semibold sm:text-base">{data?.data.username}</p>
              <p className="text-xs tracking-tight sm:text-sm">{data?.data.email}</p>
            </div>
            <p className={`duration-300 ${dropdown && "rotate-180"}`}>
              <IoIosArrowDown />
            </p>
          </div>
          {dropdown && (
            <div className="w-full popover top-14">
              <Button onClick={handleLogout} className="w-full btn-primary">
                {loading ? <div className="loader size-4 after:size-4"></div> : "Logout"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
