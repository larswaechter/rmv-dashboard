import { useRoutes } from "react-router-dom";

import PagesDashboard from "./Dashboard";
import PagesSettings from "./Settings";
import PagesDepartures from "./Departures";
import PagesTripsearch from "./Tripsearch";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PagesDashboard />,
    },
    {
      path: "/departures",
      element: <PagesDepartures />,
    },
    {
      path: "/tripsearch",
      element: <PagesTripsearch />,
    },
    {
      path: "/settings",
      element: <PagesSettings />,
    },
  ]);

  return routes;
};

export default Router;
