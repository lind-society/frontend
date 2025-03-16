import { useEffect } from "react";

import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { AddHomeVillaPage, AddPackagePage, Buy, EditHomeVillaPage, EditOwnerPage, EditRentPage, HomeVillaPage, MainPage, OwnerPage, PropertyPage, RentPage } from "./pages";

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
        <Route index path="/dashboard/main" element={<MainPage />} />
        <Route path="/dashboard/management/home-villa" element={<HomeVillaPage />} />
        <Route path="/dashboard/management/home-villa/add" element={<AddHomeVillaPage />} />
        <Route path="/dashboard/management/home-villa/edit/:id" element={<EditHomeVillaPage />} />
        <Route path="/dashboard/management/rent" element={<RentPage />} />
        <Route path="/dashboard/management/rent/edit/:id" element={<EditRentPage />} />
        <Route path="/dashboard/management/buy" element={<Buy />} />
        <Route path="/dashboard/management/owner" element={<OwnerPage />} />
        <Route path="/dashboard/management/owner/edit/:id" element={<EditOwnerPage />} />
        <Route path="/dashboard/management/property" element={<PropertyPage />} />
        <Route path="/dashboard/management/property/package/add" element={<AddPackagePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
