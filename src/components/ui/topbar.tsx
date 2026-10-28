import * as React from "react";

import { authentication, useGetApiWithAuth, usePersistentData, useToggleState } from "../../hooks";

import Select from "react-select";

import { Button, Img } from "../../components";

import { IoIosArrowDown, IoMdMenu } from "react-icons/io";

import { Currency, Data, OptionType, Payload, User } from "../../types";

/** Mirrors BASE_CURRENCY_CODE in the backend env; the id is resolved at runtime. */
const BASE_CURRENCY_CODE = "IDR";

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
    const options = currencies?.data.data;
    if (!options?.length) return;

    // Keep the stored choice only if it still exists server-side. A stale id —
    // from a previous database, or from the hardcoded `baseCurrency` constant in
    // static/api.ts — makes every list request 404 with "currency not found",
    // which surfaces as an empty page rather than an error.
    const stored = data?.value ? options.find((item) => item.id === data.value) : undefined;

    if (stored) {
      setCurrency({ value: stored.id, label: stored.code });
      return;
    }

    const base = options.find((item) => item.code === BASE_CURRENCY_CODE) ?? options[0];

    setCurrency({ value: base.id, label: base.code });
    setData({ value: base.id, label: base.code });
  }, [currencies, data]);

  return (
    <div className="sticky top-0 block w-full duration-300 border-b z-9999 bg-light">
      <div className="flex items-center justify-between p-2 mx-6">
        <div className="flex w-full gap-4">
          <button className="z-20 text-primary" onClick={handleOpenNav}>
            <IoMdMenu size={28} />
          </button>
        </div>

        <div ref={ref} className="flex items-center gap-4">
          <Select
            className="w-full text-sm min-w-80 text-dark"
            options={currencies?.data.data.map((currency) => ({ value: currency.id, label: `${currency.name} (${currency.code})` }))}
            value={currency}
            onChange={handleCurrencyChange}
            placeholder="Select Currency"
            required
          />
          <div className="relative flex items-center gap-2 cursor-pointer text-dark" onClick={toggleDropdown}>
            <Img src="/logo-circle.png" className="p-1 border rounded-full size-8 sm:size-10 border-gray/50" alt="user-profile" />
            <div className="mr-1">
              <p className="text-sm font-semibold sm:text-base">{user?.data.username}</p>
              <p className="text-xs tracking-tight sm:text-sm">{user?.data.email}</p>
            </div>
            <p className={`duration-300 ${dropdown && "rotate-180"}`}>
              <IoIosArrowDown />
            </p>
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
    </div>
  );
};
