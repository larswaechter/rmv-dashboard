import { useRoutes } from "react-router-dom";

import PagesDashboard from "./Dashboard";
import PagesSettings from "./Settings";
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
    {
      path: "/settings",
      element: <PagesSettings />,
    },
  ]);

  return routes;
};

export default Router;
