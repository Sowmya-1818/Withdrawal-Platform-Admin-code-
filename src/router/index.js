import React, { Fragment, Suspense, useContext } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import PageLoading from "../component/PageLoading";
import CoreLayout from "./CoreLayout";
import routes from "src/router/routes";
import { AuthContext } from "src/context/Auth";

const renderRoute = () => {
  return routes.map((route, i) => {
    let { element: Element, meta, path, redirect, layout } = route;
    const Layout = route.layout || Fragment;
    const Guard = route.guard ? AuthGuard : Fragment;
    return (
      <>
        <Route
          key={i}
          id={i}
          path={path}
          element={
            <Guard>
              <Suspense fallback={<PageLoading />}>
                <Layout>
                  <Element />
                </Layout>
              </Suspense>
            </Guard>
          }
        />
      </>
    );
  });
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<CoreLayout />}>
      {renderRoute()}

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  )
);
export default router;

function AuthGuard(props) {
  const { children } = props;
  const auth = useContext(AuthContext);

  if (!auth.userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
