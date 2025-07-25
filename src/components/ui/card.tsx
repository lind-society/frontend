import { Link } from "react-router-dom";

import { Img } from "../image";

import { FaRegTrashAlt, FaStar } from "react-icons/fa";

import { capitalize } from "../../utils";

interface CardContentProps {
  isLoading: boolean;
  type: string;
  datas: any[];
  message: string;
  openDeleteModal: (data: any) => void;
}

export const CardContent = ({ isLoading, datas, type, openDeleteModal, message }: CardContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center min-h-300">
        <div className="loader size-12 after:size-12"></div>
      </div>
    );
  }

  if (datas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-300">
        <p className="text-center text-dark/50">{message}</p>
      </div>
    );
  }

  const defaultImage = "/images/modern-villa-background.webp";

  return (
    <div className="flex flex-wrap gap-4 xl:gap-10 2xl:gap-4">
      {datas.map((data) => (
        <div key={data.id} className="w-full card-shadow max-w-72">
          <div className="relative w-full">
            <button onClick={() => openDeleteModal(data)} className="absolute p-2 text-sm bg-red-500 rounded-full top-2 right-2 hover:bg-red-600 text-light z-1">
              <FaRegTrashAlt />
            </button>
            <Img src={data.photos && data.photos.length > 0 ? data.photos[0] : defaultImage} alt={data.name} className="object-cover w-full h-60" />
            {type === "home-villa" && (
              <span className="absolute flex items-center gap-1 py-1.5 px-4 text-xs font-bold bg-primary bottom-0 left-0 text-light z-1">
                <FaStar />
                {data.averageRating || 0}
              </span>
            )}
          </div>
          <div className="text-primary bg-light">
            <div className="px-4 py-2 border-b border-dark/30">
              <span className="block font-medium whitespace-nowrap">
                {capitalize(data.city)} - {capitalize(data.country)}
              </span>
            </div>
            <div className="p-4 space-y-1 text-xl">
              <Link to={`/dashboard/management/${type}/edit/${data.id}`}>
                <h2 className="font-semibold">{data.name}</h2>
              </Link>
              <p className="font-bold">
                {data.currency.symbol} {data.price || data.dailyPrice || data.priceMonthly || data.priceYearly}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
