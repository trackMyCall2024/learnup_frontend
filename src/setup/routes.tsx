import React from "react";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <></>,
            },
            {
                path: "/test",
                element: <></>,
            },
            {
                path: "*",
                element: <></>,
            },
        ],
    },
]);

export default AppRoutes;
