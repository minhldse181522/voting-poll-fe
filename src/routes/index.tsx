import { Route, Routes } from "react-router";
import publicRoutes from "./publicRoutes";
import { Suspense } from "react";
import PrivateRoute from "./privateRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        const Element = (
          <Suspense fallback={<div>Loading...</div>}>
            <route.component />
          </Suspense>
        );

        return (
          <Route
            key={index}
            path={route.path}
            element={
              route.private ? <PrivateRoute>{Element}</PrivateRoute> : Element
            }
          />
        );
      })}
    </Routes>
  );
};

export default AppRoutes;
