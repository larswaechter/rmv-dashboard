import { useRoutes } from "react-router-dom";

import PagesDashboard from "./Dashboard";
import PagesWatchtower from "./Watchtower";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PagesDashboard />,
    },
    {
      path: "/watchtower",
      element: <PagesWatchtower />,
    },
  ]);

  return routes;
};

export default Router;
