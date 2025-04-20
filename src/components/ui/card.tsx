import { FaBath, FaBed, FaUser } from "react-icons/fa";
import { capitalize } from "../../utils";
import { Link } from "react-router-dom";
import { Img } from "../image";
import { GrClose } from "react-icons/gr";

interface CardContentProps<T> {
  isLoading: boolean;
  type: string;
  datas: any[];
  openDeleteModal: (data: T) => void;
}

export const CardContent = <T extends unknown>({ isLoading, datas, type, openDeleteModal }: CardContentProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex justify-center min-h-400">
        <div className="loader size-12 after:size-12"></div>
      </div>
    );
  }

  if (datas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-400">
        <span className="text-4xl font-bold text-dark/50">Buy management not found</span>
      </div>
    );
  }

  const bedrooms = 0;
  const bathrooms = 0;
  const occupancy = 0;
  const defaultImage = "/temp.png";

  return (
    <div className="flex flex-wrap gap-6">
      {datas.map((data) => (
        <div key={data.id} className="w-full card-shadow max-w-80">
          <div className="relative w-full">
            <button onClick={() => openDeleteModal(data)} className="absolute p-2 text-sm bg-red-500 rounded-full top-2 right-2 hover:bg-red-600 text-light z-1">
              <GrClose />
            </button>
            <Img src={data.photos && data.photos.length > 0 ? data.photos[0] : defaultImage} alt={data.name} className="object-cover w-full h-60" />
          </div>
          <div className="text-primary bg-light">
            <div className="flex items-center justify-between px-4 py-2 border-b border-dark/30">
              <span className="block font-medium">{capitalize(data.state)}</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <FaBed className="p-1.5 rounded-full bg-primary/20" size={24} /> {bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <FaBath className="p-1.5 rounded-full bg-primary/20" size={24} /> {bathrooms}
                </span>
                <span className="flex items-center gap-1">
                  <FaUser className="p-1.5 rounded-full bg-primary/20" size={24} /> {occupancy}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-1 text-xl">
              <Link to={`/dashboard/management/${type}/edit/${data.id}`}>
                <h2 className="font-semibold">{data.name}</h2>
              </Link>
              <p className="font-bold">{data.price || data.priceDaily || data.priceMonthly || data.priceYearly}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
