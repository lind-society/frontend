import * as React from "react";

import { authentication, useGetApiWithAuth, usePersistentData, useToggleState } from "../../hooks";

import Select from "react-select";

import { Button, Img } from "../../components";

import { IoIosArrowDown, IoMdMenu } from "react-icons/io";

import { baseCurrency } from "../../static";

import { Currency, Data, OptionType, Payload, User } from "../../types";

export const TopBar = ({ handleOpenNav }: { handleOpenNav: () => void }) => {
  const [ref, dropdown, toggleDropdown] = useToggleState(false);
  const [currency, setCurrency] = React.useState<OptionType | null>(null);

  const useStore = usePersistentData<OptionType>("selected-currency", "localStorage");
  const { setData, data } = useStore();

  const { data: user } = useGetApiWithAuth<Payload<User>>({ key: ["profile"], url: `/admins/profile` });
  const { data: currencies } = useGetApiWithAuth<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "/currencies" });

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await authentication.logout();
    setLoading(false);
  };

  const handleCurrencyChange = (option: OptionType | null) => {
    setCurrency(option);
    setData({ value: option?.value, label: option?.label });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  React.useEffect(() => {
    if (data && data.value && data.label) {
      setCurrency({ value: data.value, label: data.label });
    } else {
      setCurrency({ value: baseCurrency, label: "IDR" });
      setData({ value: baseCurrency, label: "IDR" });
    }

    return () => setCurrency(null);
  }, []);

  return (
    <div className="sticky top-0 block w-full duration-300 border-b z-9999 bg-light">
      <div className="flex items-center justify-between p-2 mx-6">
        <div className="flex w-full gap-4">
          <button className="z-20 text-primary" onClick={handleOpenNav}>
            <IoMdMenu size={28} />
          </button>
        </div>

        <div ref={ref} className="relative flex items-center gap-4">
          <Select
            className="w-full text-sm min-w-40 text-dark"
            options={currencies?.data.data.map((currency) => ({ value: currency.id, label: currency.code }))}
            value={currency}
            onChange={handleCurrencyChange}
            placeholder="Select Currency"
            required
          />
          <div className="flex items-center gap-2 cursor-pointer text-dark" onClick={toggleDropdown}>
            <Img src="/logo-circle.png" className="p-1 border rounded-full size-8 sm:size-10 border-gray/50" alt="user-profile" />
            <div className="mr-1">
              <p className="text-sm font-semibold sm:text-base">{user?.data.username}</p>
              <p className="text-xs tracking-tight sm:text-sm">{user?.data.email}</p>
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
