import { useEffect } from "react";

import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import {
  ActivityPage,
  AddActivityPage,
  EditActivityPage,
  AddBuyPage,
  AddHomeVillaPage,
  AddPackagePage,
  APITest,
  BuyPage,
  EditBuyPage,
  EditHomeVillaPage,
  EditPackagePage,
  EditRentPage,
  HomeVillaPage,
  LoginPage,
  MainPage,
  NotFoundPage,
  OwnerPage,
  PropertyPage,
  RentPage,
  OrderPage,
  ReviewPage,
} from "./pages";

import { ProtectedRoute } from "./routes/protected-route";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />

        <Route index path="/admin/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/main" element={<MainPage />} />
          <Route path="/dashboard/management/home-villa" element={<HomeVillaPage />} />
          <Route path="/dashboard/management/home-villa/add" element={<AddHomeVillaPage />} />
          <Route path="/dashboard/management/home-villa/edit/:id" element={<EditHomeVillaPage />} />
          <Route path="/dashboard/management/activity" element={<ActivityPage />} />
          <Route path="/dashboard/management/activity/add" element={<AddActivityPage />} />
          <Route path="/dashboard/management/activity/edit/:id" element={<EditActivityPage />} />
          <Route path="/dashboard/management/buy" element={<BuyPage />} />
          <Route path="/dashboard/management/buy/add" element={<AddBuyPage />} />
          <Route path="/dashboard/management/buy/edit/:id" element={<EditBuyPage />} />
          <Route path="/dashboard/management/owner" element={<OwnerPage />} />
          <Route path="/dashboard/management/rent" element={<RentPage />} />
          <Route path="/dashboard/management/rent/edit/:id" element={<EditRentPage />} />
          <Route path="/dashboard/management/order" element={<OrderPage />} />
          <Route path="/dashboard/management/property" element={<PropertyPage />} />
          <Route path="/dashboard/management/property/package/add" element={<AddPackagePage />} />
          <Route path="/dashboard/management/property/package/edit/:id" element={<EditPackagePage />} />
          <Route path="/dashboard/management/review" element={<ReviewPage />} />
        </Route>

        <Route path="/api-test" element={<APITest />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
