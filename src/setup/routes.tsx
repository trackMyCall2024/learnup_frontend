import React from "react";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Page/Dashboard/Dashboard";
import Courses from "../Page/Course/Courses";
import Social from "../Page/Social/Social";
import Profile from "../Page/Profile/Profile";
import Blocker from "../Page/Blocker/Blocker";
import Settings from "../Page/Settings/Settings";

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                path: "/dashboard",
                element: <Dashboard/>,
            },
            {
                path: "/courses",
                element: <Courses/>,
            },
            {
                path: "/social",
                element: <Social/>,
            },
            {
                path: "/profile",
                element: <Profile/>,
            },
            {
                path: "/blocker",
                element: <Blocker/>,
            },
            {
                path: "/settings",
                element: <Settings/>,
            },
            {
                path: "*",
                element: <></>,
            },
        ],
    },
]);

export default AppRoutes;
