import { useRoutes } from "react-router-dom";

import PagesDashboard from "./Dashboard";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PagesDashboard />,
    },
  ]);

  return routes;
};

export default Router;
