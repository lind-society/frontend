import { useGetApi } from "../hooks";

export const APITest = () => {
  const { data, isLoading } = useGetApi({ key: ["test-api"], url: "" });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <div className="loader size-16 after:size-16"></div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-svh bg-gray">
      <h1 className="text-4xl text-dark">{`${data}` || "FAILED"}</h1>
    </div>
  );
};
