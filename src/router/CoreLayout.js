import React, { memo } from "react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PageLoading from "../component/PageLoading";

const CoreLayout = memo((props) => {
  return (
    <div className="core-layout">
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </div>
  );
});

export default CoreLayout;
