import { useRoutes } from "react-router-dom";

import PagesDashboard from "./Dashboard";
import PagesDelayAlarm from "./DelayAlarm";

const Router = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <PagesDashboard />,
    },
    {
      path: "/delay-alarm",
      element: <PagesDelayAlarm />,
    },
  ]);

  return routes;
};

export default Router;
