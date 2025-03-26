import { Link, useNavigate } from "react-router-dom";

import { useDeleteApi, useGetApi } from "../../../../hooks";

import { Layout } from "../../../../components/ui";
import { Button, Img } from "../../../../components";

import { FaBath, FaBed, FaPlus, FaUser } from "react-icons/fa";

import { Data, Payload, Property } from "../../../../types";

import { capitalize } from "../../../../utils";

export const BuyPage = () => {
  const navigate = useNavigate();

  const { data: properties, isLoading } = useGetApi<Payload<Data<Property[]>>>({ key: ["get-properties"], url: `properties` });
  const { mutate: deleteVilla } = useDeleteApi("properties", ["delete-property"]);

  const handleDeleteVilla = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    deleteVilla(id);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Property Management</h1>

        <div className="flex items-center gap-2">
          <Button className="btn-outline">Filters</Button>
          <Button onClick={() => navigate("/dashboard/management/buy/add")} className="flex items-center gap-2 btn-primary">
            <FaPlus /> Add New
          </Button>
        </div>
      </header>

      {/* Properties Grid */}

      {isLoading ? (
        <div className="flex justify-center min-h-200">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {properties?.data.data.length! < 1 ? (
            <div className="flex items-center justify-center min-h-200">
              <span className="text-4xl font-bold text-dark/50">Property not found</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {properties?.data.data.map((villa) => (
                <div key={villa.id} className="overflow-hidden card-shadow">
                  <div className="relative w-full">
                    {villa && (
                      <button onClick={(e) => handleDeleteVilla(e, villa.id)} className="absolute top-0 left-0 px-2 py-1 text-sm bg-red-500 rounded-ee-md text-light z-1">
                        X
                      </button>
                    )}
                    <Img src={villa.photos[0] || "/temp.png"} alt={villa.name} className="object-cover w-full h-60" />
                    {/* <div className="absolute bottom-0 left-0 flex items-center gap-1 py-1.5 px-4 bg-primary text-light rounded-se-md">
                      <FaStar size={14} />
                      <span className="text-xs">{calculateAverageRating(villa.reviews)}</span>
                    </div> */}
                  </div>
                  <div className="text-primary">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-dark/30">
                      <span className="block font-medium">{capitalize(villa.state)}</span>
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
                    <div className="p-4 space-y-1 text-xl">
                      <Link to={`/dashboard/management/buy/edit/${46786123874621}`}>
                        <h2 className="font-semibold">{villa.name}</h2>
                      </Link>
                      <p className="font-bold">
                        {/* {villa.currency.symbol} */}
                        {villa.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};
