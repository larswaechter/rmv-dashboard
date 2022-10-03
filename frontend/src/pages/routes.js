import { useRoutes } from "react-router-dom";
import PagesDashboard from "./Dashboard";
import PagesLocationSearch from "./Locationsearch";
import PagesSettings from "./Settings";
import PagesStationboards from "./Stationboards";
import PagesTripsearch from "./Tripsearch";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PagesDashboard />,
    },
    {
      path: "/stationboard",
      element: <PagesStationboards />,
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
