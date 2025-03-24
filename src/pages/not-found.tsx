import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-tertiary text-primary">
      <h1 className="font-bold text-8xl">404</h1>
      <p className="mt-4 text-xl">Oops! Page Not Found</p>
      <Link to="/dashboard/main" className="px-6 py-3 mt-6 text-white transition rounded-lg bg-primary hover:bg-opacity-80">
        Go to the dashboard main
      </Link>
    </div>
  );
};
