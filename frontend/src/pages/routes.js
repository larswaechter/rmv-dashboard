import { useRoutes } from "react-router-dom";
import PagesDashboard from "./Dashboard";
import PagesLocationSearch from "./Locationsearch";
import PagesSettings from "./Settings";
import PagesTripsearch from "./Tripsearch";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PagesDashboard />,
    },
    {
      path: "/tripsearch",
      element: <PagesTripsearch />,
    },
    {
      path: "/locationsearch",
      element: <PagesLocationSearch />,
    },
    {
      path: "/settings",
      element: <PagesSettings />,
    },
  ]);

  return routes;
};

export default Router;
