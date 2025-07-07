import * as React from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useGetApi, useGetApiWithAuth, useUpdateApi } from "../../../../../hooks";

import Select from "react-select";
import DatePicker from "react-datepicker";

import { Layout } from "../../../../../components/ui";
import { Button, NumberInput } from "../../../../../components";

import { FaArrowLeft } from "react-icons/fa";

import { statusBookings } from "../../../../../static";

import { Booking, Currency, Data, OptionType, Payload, PhoneCodes } from "../../../../../types";

export const EditRentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [email, setEmail] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [totalAmount, setTotalAmount] = React.useState<string>("");
  const [totalGuest, setTotalGuest] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [checkInDate, setCheckInDate] = React.useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = React.useState<Date | null>(null);
  const [phoneCountryCode, setPhoneCountryCode] = React.useState<OptionType | null>(null);
  const [currency, setCurrency] = React.useState<OptionType | null>(null);

  const { data: currencies } = useGetApiWithAuth<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "/currencies" });
  const { data: respBooking } = useGetApi<Payload<Booking>>({ key: ["get-booking", id], url: `bookings/${id}`, params: { type: "villa" } });
  const { data: phoneCodes } = useGetApi<PhoneCodes[]>({ key: ["get-phone-dial-codes"], url: "regions/phone-codes" });
  const { mutate: editBooking } = useUpdateApi<Partial<Booking>>({ key: ["edit-booking"], url: "/bookings", redirectPath: `/dashboard/management/rent/edit/${id}` });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      customer: {
        email,
        name,
        phoneNumber,
        phoneCountryCode: phoneCountryCode?.value || "",
      } as Booking["customer"],
      totalAmount: Number(totalAmount),
      totalGuest: Number(totalGuest),
      status,
      checkInDate: checkInDate?.toDateString(),
      checkOutDate: checkOutDate?.toDateString(),
      currencyId: currency?.value || "",
    };
    editBooking({ id: id || "", updatedItem: dataToSave });
  };

  React.useEffect(() => {
    if (respBooking && currencies && phoneCodes) {
      const customer = respBooking.data.customer;
      const findCurrency = currencies.data.data.find((c) => c.id === respBooking.data.currencyId);
      const findPhoneCode = phoneCodes.find((phone: any) => phone.dial_code === customer.phoneCountryCode);

      setName(customer.name);
      setEmail(customer.email);
      setPhoneNumber(customer.phoneNumber);
      setTotalAmount(String(respBooking.data.totalAmount));
      setTotalGuest(String(respBooking.data.totalGuest));
      setStatus(respBooking.data.status);
      setCheckInDate(new Date(respBooking.data.checkInDate));
      setCheckOutDate(new Date(respBooking.data.checkOutDate));
      setPhoneCountryCode({ value: findPhoneCode?.dial_code || "", label: `${findPhoneCode?.name} (${findPhoneCode?.dial_code})` });
      setCurrency({ value: findCurrency?.id || "", label: findCurrency?.code || "" });
    }
  }, [respBooking, currencies, phoneCodes]);

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center gap-4 pb-4 mb-6 border-b border-dark/30">
        <Button className="btn-primary" onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </Button>
        <h1 className="head-title">Edit Booking</h1>
      </header>
      <div className="flex">
        <button className={`px-4 py-1.5 border border-dark/30 rounded-t-md bg-primary text-light`}>Edit Booking</button>
      </div>
      <div className="p-8 border rounded-b bg-light border-dark/30">
        <h2 className="heading">Edit Booking</h2>

        <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
          {/* Property name */}
          <div className="flex items-center">
            <span className="block whitespace-nowrap min-w-60">Property name</span>
            <input type="text" className="input-text" placeholder="Urna Santal Villa" value={respBooking?.data.villa.name || ""} readOnly />
          </div>
          <div className="flex items-center">
            <span className="block whitespace-nowrap min-w-60">Secondary property name</span>
            <input type="text" className="input-text" placeholder="Urna Cangau" value={respBooking?.data.villa.secondaryName || ""} readOnly />
          </div>

          {/* Rent */}
          <div className="flex items-center gap-8">
            <div className="flex items-center w-full">
              <span className="block whitespace-nowrap min-w-60">Status</span>
              <select className="w-full input-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusBookings.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center w-full max-w-lg gap-12">
              <div className="relative flex items-center w-full gap-4">
                <span className="whitespace-nowrap">Check In</span>
                <div className="w-full datepicker-container">
                  <DatePicker dateFormat="dd/MM/yyyy" selected={checkInDate} toggleCalendarOnIconClick closeOnScroll onChange={(date) => setCheckInDate(date)} showIcon className="!pl-8 input-text" />
                </div>
              </div>
              <div className="relative flex items-center w-full gap-4">
                <span className="whitespace-nowrap">Check Out</span>
                <div className="w-full datepicker-container">
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={checkOutDate}
                    toggleCalendarOnIconClick
                    closeOnScroll
                    onChange={(date) => setCheckOutDate(date)}
                    showIcon
                    className="!pl-8 input-text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* price */}
          <div className="flex items-center gap-2">
            <div className="flex items-center w-full">
              <span className="block whitespace-nowrap min-w-60">Price</span>
              <Select
                className="w-full text-sm"
                options={currencies?.data.data.map((currency) => ({ value: currency.id, label: currency.code }))}
                value={currency}
                onChange={(option) => setCurrency(option)}
                placeholder="Select Currency"
                required
              />
            </div>

            <NumberInput
              className="input-text"
              value={totalAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (+value < 0) return;
                setTotalAmount(value);
              }}
              placeholder={currency?.label ? `Enter currency in ${currency?.label}` : "Select currency first"}
              disabled={!currency}
              required
            />
          </div>

          {/* Identity email, name */}
          <div className="flex items-center">
            <span className="block whitespace-nowrap min-w-60">Email</span>
            <input type="text" className="input-text" placeholder="johndoe.10@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex items-center">
            <span className="block whitespace-nowrap min-w-60">Name</span>
            <input type="text" className="input-text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* price */}
          <div className="flex items-center gap-2">
            <div className="flex items-center w-full">
              <span className="block whitespace-nowrap min-w-60">Phone Number</span>
              <Select
                className="w-full text-sm"
                options={phoneCodes?.map((phone) => ({ value: phone.dial_code, label: `${phone.name} (${phone.dial_code})` }))}
                value={phoneCountryCode}
                onChange={(option) => setPhoneCountryCode(option)}
                placeholder="Select Currency"
                required
              />
            </div>
            <NumberInput
              className="w-full input-text"
              value={phoneNumber}
              placeholder="894613831"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length >= 16) return;
                setPhoneNumber(value);
              }}
              required
            />
          </div>

          {/* guest */}
          <div className="flex items-center w-full">
            <span className="block whitespace-nowrap min-w-60">Guest</span>
            <select className="w-full input-select" value={totalGuest} onChange={(e) => setTotalGuest(e.target.value)}>
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1} Guest
                </option>
              ))}
            </select>
          </div>

          {/* <div className="w-full max-w-xs bg-light ms-auto">
            <p className="pb-2 text-lg font-semibold border-b border-dark/30">Price Details</p>
            <div className="my-2 space-y-2">
              <span className="flex items-center justify-between w-full text-sm">
                <p>IDR 4.900.000</p> <p>IDR 34.900.000</p>
              </span>
              <span className="flex items-center justify-between w-full text-sm">
                <p>Booking.com service fee</p> <p>IDR 400,000</p>
              </span>
              <span className="flex items-center justify-between w-full text-sm">
                <p>Private Chef</p> <p>IDR 200,000</p>
              </span>
            </div>
            <p className="pt-2 text-lg font-semibold border-t border-dark/30">Total: IDR {calculateTotal()}</p>
          </div> */}

          <div className="flex justify-end gap-4">
            <Button type="button" className="btn-outline">
              Reset
            </Button>
            <Button type="submit" className="btn-primary">
              Save
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
