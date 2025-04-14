import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDeleteApi, useGetApi } from "../../../../hooks";

import { Layout } from "../../../../components/ui";
import { Button, Img, Modal } from "../../../../components";

import { FaBath, FaBed, FaPlus, FaStar, FaUser } from "react-icons/fa";
import { GrClose } from "react-icons/gr";

import { calculateAverageRating, capitalize } from "../../../../utils";

import { Data, Payload, Villa } from "../../../../types";

export const HomeVillaPage = () => {
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [villa, setVilla] = useState<Villa>();

  const { data: villas, isLoading } = useGetApi<Payload<Data<Villa[]>>>({ key: ["get-villas"], url: `villas` });
  const { mutate: deleteVilla, isPending } = useDeleteApi({ url: "villas", key: ["delete-villa"], redirectPath: "/dashboard/management/home-villa" });

  const handleDeleteVilla = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    deleteVilla(id);
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Villa & Home Management</h1>

        <Button onClick={() => navigate("/dashboard/management/home-villa/add")} className="flex items-center gap-2 btn-primary">
          <FaPlus /> Add New
        </Button>
      </header>

      {/* Notification and filters*/}
      {/* <div className="flex justify-between gap-8 mb-8">
        <div className="flex items-center w-full gap-1 px-1 border rounded bg-light text-primary border-dark/30"></div>
        <Button className="btn-outline">Filters</Button>
      </div> */}

      {/* Villas Grid */}

      {isLoading ? (
        <div className="flex justify-center min-h-200">
          <div className="loader size-12 after:size-12"></div>
        </div>
      ) : (
        <>
          {villas?.data.data.length! < 1 ? (
            <div className="flex items-center justify-center min-h-200">
              <span className="text-4xl font-bold text-dark/50">Villas not found</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {villas?.data.data.map((villa) => (
                <div key={villa.id} className="w-full overflow-hidden card-shadow max-w-80">
                  <div className="relative w-full">
                    {villa && (
                      <button
                        onClick={() => {
                          setVilla(villa);
                          setDeleteModal(true);
                        }}
                        className="absolute p-2 text-sm bg-red-500 rounded-full top-2 right-2 hover:bg-red-600 text-light z-1"
                      >
                        <GrClose />
                      </button>
                    )}
                    <Img src={villa.photos[0] || "/temp.png"} alt={villa.name} className="object-cover w-full h-60" />
                    <div className="absolute bottom-0 left-0 flex items-center gap-1 py-1.5 px-4 bg-primary text-light rounded-se-md">
                      <FaStar size={14} />
                      <span className="text-xs">{calculateAverageRating(villa.reviews)}</span>
                    </div>
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
                    <div className="p-4 space-y-2">
                      <Link to={`/dashboard/management/home-villa/edit/${villa.id}`}>
                        <h2 className="text-xl font-bold">{villa.name}</h2>
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
          )}
        </>
      )}
      <Modal onClose={() => setDeleteModal(false)} isVisible={deleteModal}>
        <h2 className="heading">Delete Villa Data</h2>
        <p className="mt-2 mb-6">Are you sure you want to delete this villa {villa?.name}?</p>
        <div className="flex justify-end">
          <Button type="submit" className={`btn-red ${isPending && "animate-pulse"}`} onClick={(e) => handleDeleteVilla(e, villa?.id || "")}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};
