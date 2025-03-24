import * as React from "react";

import { Layout } from "../../../../components/ui";
import { Button } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

interface Service {
  id: number;
  title: string;
  isFree: boolean;
  price: string;
  currency: string;
}

export const EditRentPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>("");
  const [fullname, setFullname] = React.useState<string>("");
  const [propertyName, setPropertyName] = React.useState<string>("");
  const [secondPropertyName, setSecondPropertyName] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [checkIn, setCheckIn] = React.useState<Date | null>(new Date());
  const [checkOut, setCheckOut] = React.useState<Date | null>(new Date());

  const [services, setServices] = React.useState<Service[]>([{ id: 1, title: "", isFree: false, price: "", currency: "Rp" }]);

  const addService = (e: React.MouseEvent) => {
    e.preventDefault();
    setServices([...services, { id: Date.now(), title: "", isFree: false, price: "", currency: "Rupiah (Rp)" }]);
  };

  const updateService = (id: number, key: string, value: string | boolean) => {
    setServices(services.map((service) => (service.id === id ? { ...service, [key]: value } : service)));
  };

  const removeService = (id: number) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const resetService = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setServices(services.map((service) => (service.id === id ? { ...service, title: "", isFree: false, price: "", currency: "Rp" } : service)));
    // setSections(sections.map((section) => (section.id === id ? { ...section, name: "", description: "", photo: null } : section)));
  };

  const calculateTotal = () => {
    const nightlyRate = 4900000;
    const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 1;
    const roomCost = nightlyRate * nights;
    const serviceFee = 400000;
    const additionalCost = services.reduce((acc, service) => acc + +service.price, 0);
    return roomCost + serviceFee + additionalCost;
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
        <h1 className="text-2xl font-bold">Edit Booking</h1>

        <Button onClick={() => navigate("/dashboard/management/rent")} className="btn-outline">
          Close
        </Button>
      </header>
      <div className="flex">
        <button className={`px-4 py-1.5 border border-dark/20 rounded-t-md bg-primary text-light`}>Edit Booking</button>
      </div>
      <div className="p-8 border rounded-b bg-light border-dark/20">
        <h2 className="heading">Edit Booking</h2>

        <form className="mt-6 space-y-8">
          {/* Property name */}
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Property name</label>
            <input type="text" className="input-text" placeholder="Urna Santal Villa" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Secondary property name</label>
            <input type="text" className="input-text" placeholder="Urna Cangau" value={secondPropertyName} onChange={(e) => setSecondPropertyName(e.target.value)} />
          </div>

          {/* Rent */}
          <div className="flex items-center gap-8">
            <div className="flex items-center w-full">
              <label className="block whitespace-nowrap min-w-60">Rent</label>
              <select className="w-full input-select">
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">yearly</option>
              </select>
            </div>

            <div className="flex items-center w-full max-w-lg gap-12">
              <div className="relative w-full">
                <label className="block text-sm">Check In</label>
                <input type="date" className="text-sm appearance-none" onChange={(e) => setCheckIn(e.target.valueAsDate)} />
              </div>
              <div className="relative w-full">
                <label className="block text-sm">Check Out</label>
                <input type="date" className="text-sm appearance-none" onChange={(e) => setCheckOut(e.target.valueAsDate)} />
              </div>
            </div>
          </div>

          {/* price */}
          <div className="flex items-center gap-8">
            <div className="flex items-center w-full">
              <label className="block whitespace-nowrap min-w-60">Price</label>
              <select className="w-full input-select">
                <option value="Rp">Rupiah (Rp)</option>
                <option value="$">Dollar ($)</option>
              </select>
            </div>

            <input type="text" className="w-full max-w-lg input-text" placeholder="9000000" readOnly />
          </div>

          {/* Identity email, fullname */}
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Email</label>
            <input type="text" className="input-text" placeholder="johndoe.10@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Fullname</label>
            <input type="text" className="input-text" placeholder="John Doe" value={fullname} onChange={(e) => setFullname(e.target.value)} />
          </div>

          {/* price */}
          <div className="flex items-center gap-8">
            <div className="flex items-center w-full">
              <label className="block whitespace-nowrap min-w-60">Phone Number</label>
              <select className="w-full input-select">
                <option value="">+62</option>
                <option value="">+52</option>
                <option value="">+78</option>
              </select>
            </div>

            <input type="text" className="w-full max-w-lg input-text" placeholder="+62894613831" readOnly />
          </div>

          {/* guest */}
          <div className="flex items-center w-full">
            <label className="block whitespace-nowrap min-w-60">Guest</label>
            <select className="w-full input-select">
              <option value="1">1 Guest</option>
              <option value="2">2 Guest</option>
              <option value="3">3 Guest</option>
            </select>
          </div>

          {/* message */}
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Message</label>
            <textarea rows={2} className="input-text" placeholder="John Doe" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          <h2 className="mt-6 heading">Additional Services</h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="space-y-4">
                <div className="flex items-center">
                  <label className="block whitespace-nowrap min-w-60">Title *</label>
                  <input
                    type="text"
                    placeholder="input the title service"
                    value={service.title}
                    onChange={(e) => updateService(service.id, "title", e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </div>
                <div className="flex items-center">
                  <div className="flex items-center w-full">
                    <label className="block whitespace-nowrap min-w-60">Free *</label>
                    <div className="flex items-center gap-8 px-8">
                      <label className="flex items-center gap-4">
                        Yes <input type="checkbox" className="accent-primary size-4" checked={service.isFree} onChange={() => updateService(service.id, "isFree", true)} />
                      </label>
                      <label className="flex items-center gap-4">
                        No <input type="checkbox" className="accent-primary size-4" checked={!service.isFree} onChange={() => updateService(service.id, "isFree", false)} />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="block whitespace-nowrap">Price *</label>
                    <select value={service.currency} onChange={(e) => updateService(service.id, "currency", e.target.value)} className="input-select min-w-60">
                      <option value="Rp">Rupiah (Rp)</option>
                      <option value="$">Dollar ($)</option>
                    </select>
                    <input type="text" placeholder="2000000" value={service.price} onChange={(e) => updateService(service.id, "price", e.target.value)} className="input-text min-w-60" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button onClick={(e: React.MouseEvent) => resetService(e, service.id)} className="w-full btn-outline">
                    Reset
                  </Button>
                  <Button onClick={() => removeService(service.id)} className="w-full btn-red">
                    Delete
                  </Button>
                  <Button onClick={addService} className="flex items-center w-full gap-2 btn-green">
                    <FaPlus /> Add More
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-xs bg-light ms-auto">
            <p className="pb-2 text-lg font-semibold border-b border-dark/20">Price Details</p>
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
            <p className="pt-2 text-lg font-semibold border-t border-dark/20">Total: IDR {calculateTotal()}</p>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end gap-4">
            <Button className="btn-outline">Reset</Button>
            <Button className="btn-primary">Save</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
