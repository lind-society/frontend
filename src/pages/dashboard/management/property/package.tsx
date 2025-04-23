import { Button } from "../../../../components";
import { useGetApi } from "../../../../hooks";
import { Data, Payload } from "../../../../types";
import { Package } from "../../../../types/api/package";

export const PackageTab = () => {
  const { data: responsePackages, isLoading } = useGetApi<Payload<Data<Package[]>>>({ key: ["get-packages"], url: "packages" });

  return (
    <div className="p-8 space-y-4 border rounded-b bg-light border-dark/30">
      {isLoading ? (
        <div className="flex justify-center min-h-400">
          <div className="loader size-12 after:size-12"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 text-primary">
          {responsePackages?.data.data.map((item) => (
            <div key={item.id} className="p-4 space-y-4 border rounded bg-light border-primary">
              <h5 className="text-2xl font-semibold line-clamp-1">{item.name}</h5>
              <p className="leading-normal text-justify line-clamp-6">{item.description}</p>
              <Button className="w-full btn-primary">Edit</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
