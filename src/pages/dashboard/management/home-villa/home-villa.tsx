import { Link, useNavigate } from "react-router-dom";

import { Layout } from "../../../../components/ui";
import { useGetApi } from "../../../../hooks";
import { Button, Img } from "../../../../components";

import { FaBath, FaBed, FaStar, FaUser } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { Data, Payload, Villa } from "../../../../types";
import { calculateAverageRating } from "../../../../utils/calculateAverageRating";
import { baseApiURL } from "../../../../static";

export const HomeVillaPage = () => {
  const navigate = useNavigate();
  const {
    data: villas,
    error,
    isLoading,
  } = useGetApi<Payload<Data<Villa[]>>>({
    key: ["villas"],
    url: `${baseApiURL}/villas`,
  });

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">The are wrong when fetching data</p>;

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
        <h1 className="text-2xl font-bold">Villa & Home Management</h1>

        <Button onClick={() => navigate("/dashboard/management/home-villa/add")} className="btn-primary">
          + Add New
        </Button>
      </header>

      {/* Notification and filters*/}
      <div className="flex justify-between gap-8 mb-8">
        <div className="flex items-center w-full gap-1 px-1 border rounded-md bg-light text-primary border-dark/20">
          <IoMdNotifications size={20} />
          You have <strong>9</strong> new unchecked bookings!
        </div>
        <Button className="btn-outline">Filters</Button>
      </div>

      {/* Villas Grid */}
      <div className="grid grid-cols-3 gap-6">
        {villas?.data.data.map((villa) => (
          <div key={villa.id} className="overflow-hidden card-shadow">
            <div className="relative w-full">
              {villa.soldStatus && <div className="absolute top-0 left-0 px-2 py-1 text-sm bg-red-500 rounded-ee-md text-light z-1">3 New Bookings</div>}
              <Img src={villa.photos[0] || "/temp.png"} alt={villa.name} className="object-cover w-full h-60" />
              <div className="absolute bottom-0 left-0 flex items-center gap-1 py-1.5 px-4 bg-primary text-light rounded-se-md">
                <FaStar size={14} />
                <span className="text-xs">{calculateAverageRating(villa.reviews)}</span>
              </div>
            </div>
            <div className="text-primary">
              <div className="flex items-center justify-between px-4 py-2 border-b border-dark/20">
                <p className="text-sm text-gray-500">
                  {villa.city}, {villa.state}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <FaBed className="p-1.5 rounded-full bg-primary/20" size={24} /> 4
                  </span>
                  <span className="flex items-center gap-1">
                    <FaBath className="p-1.5 rounded-full bg-primary/20" size={24} /> 5
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUser className="p-1.5 rounded-full bg-primary/20" size={24} /> 9
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <Link to={`/dashboard/management/home-villa/edit/${46786123874621}`}>
                  <h2 className="text-lg font-semibold">{villa.name}</h2>
                </Link>
                <div>
                  <small className="italic">Per Night</small>
                  <p className="font-bold">
                    {villa.currency.symbol} {villa.priceDaily}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};
