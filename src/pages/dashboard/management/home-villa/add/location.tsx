import * as React from "react";
import { IoMdSearch } from "react-icons/io";
import { Button, Modal } from "../../../../../components";
import { FaMinus } from "react-icons/fa6";

export const Location = () => {
  const [modalInput, setModalInput] = React.useState<boolean>(false);

  const [address, setAddress] = React.useState<string>("");
  const [postalCode, setPostalCode] = React.useState<string>("");

  return (
    <div className="p-8 border rounded-b bg-light border-dark/20">
      <h2 className="heading">Location</h2>
      <form className="mt-6 space-y-6">
        {/* Location name */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Address *</label>
          <input type="text" className="input-text" placeholder="Jln. Soekarno Hatta No. 59" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        {/* Country */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Country *</label>
          <select className="w-full input-select">
            <option>Indonesia</option>
            <option>Spain</option>
            <option>Portugal</option>
          </select>
        </div>

        {/* State / Province / Region */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">State / Province / Region *</label>
          <select className="w-full input-select">
            <option>Jakarta</option>
            <option>Bali</option>
            <option>Bandung</option>
          </select>
        </div>

        {/* City */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">City *</label>
          <select className="w-full input-select">
            <option>Bekasi</option>
            <option>Depok</option>
            <option>Tangerang</option>
          </select>
        </div>

        {/* Postal code */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Postal code *</label>
          <input type="text" className="input-text" placeholder="1234567" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>

        {/* Google Map Link */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Google Map Link *</label>
          <input type="text" className="input-text" placeholder="https://maps.app.goo.gl/aDuVPL5Z71jRMsjz5" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>
      </form>

      {/* Nearest Place */}
      <h2 className="mt-8 heading">Nearest Place</h2>
      <div className="flex items-stretch w-full mt-4 overflow-hidden border rounded-lg border-dark/20">
        <input type="text" placeholder="Search place" className="flex-1 px-4 py-2 text-dark placeholder-dark/30 focus:outline-none" onClick={() => setModalInput(true)} readOnly />
        <button className="flex items-center justify-center h-10 text-light bg-primary w-14">
          <IoMdSearch size={25} />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <span className="flex items-center justify-between w-full">
          <p>Baked. Berawa Bakery</p>
          <p className="flex items-center gap-1 pr-1">
            84 m
            <button>
              <FaMinus />
            </button>
          </p>
        </span>
        <span className="flex items-center justify-between w-full">
          <p>Riviera Bistro</p>
          <p className="flex items-center gap-1 pr-1">
            220 m
            <button>
              <FaMinus />
            </button>
          </p>
        </span>
        <span className="flex items-center justify-between w-full">
          <p>Berawa Beach</p>
          <p className="flex items-center gap-1 pr-1">
            950 m
            <button>
              <FaMinus />
            </button>
          </p>
        </span>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button className="btn-outline">Reset</Button>
        <Button className="btn-primary">Save</Button>
      </div>

      <Modal isVisible={modalInput} onClose={() => setModalInput(false)}>
        <div className="flex items-stretch w-full mt-4 overflow-hidden border rounded-lg border-dark/20">
          <input type="text" placeholder="Search place" className="flex-1 px-4 py-2 text-dark placeholder-dark/30 focus:outline-none" onClick={() => setModalInput(false)} readOnly />
          <button className="flex items-center justify-center h-10 text-light bg-primary w-14">
            <IoMdSearch size={25} />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          <span className="flex items-center justify-between w-full">
            <p>Baked. Berawa Bakery</p>
            <p className="flex items-center gap-1 pr-1">
              84 m
              <button>
                <FaMinus />
              </button>
            </p>
          </span>
          <span className="flex items-center justify-between w-full">
            <p>Riviera Bistro</p>
            <p className="flex items-center gap-1 pr-1">
              220 m
              <button>
                <FaMinus />
              </button>
            </p>
          </span>
          <span className="flex items-center justify-between w-full">
            <p>Berawa Beach</p>
            <p className="flex items-center gap-1 pr-1">
              950 m
              <button>
                <FaMinus />
              </button>
            </p>
          </span>
        </div>
      </Modal>
    </div>
  );
};
