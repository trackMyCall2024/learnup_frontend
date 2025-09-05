import React from "react";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Page/Dashboard/Dashboard";
import Social from "../Page/Social/Social";
import Profile from "../Page/Profile/Profile";
import Blocker from "../Page/Blocker/Blocker";
import Settings from "../Page/Settings/Settings";
import Directory from "../Page/Course/Directory";
import Section from "../Page/Section/Section";
import { Page } from "../interface.global";
import NotFound from "../Page/NotFound/NotFound";

const checkPageFromURL = (path: string) => {
    const pathArray = path.split('/');
    const page = pathArray[1];
    console.log('page', page);
    
    switch (page) {
        case 'dashboard':
            return Page.Dashboard;
        case 'courses':
            return Page.Courses;
        case 'chapters':
            return Page.Chapters;
        case 'sections':
            return Page.Sections;
        case 'section':
            return Page.Section;
        case 'social':
            return Page.Social;
        case 'profile':
            return Page.Profile;
        case 'settings':
            return Page.Settings;
        default:
            return null;
    }
};

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
                path: "/courses/:id",
                element: <Directory/>,
            },
            {
                path: "/chapters/:id",
                element: <Directory/>,
            },
            {
                path: "/sections/:id",
                element: <Directory/>,
            },
            {
                path: "/section/:id",
                element: <Section/>,
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
                path: "/404",
                element: <NotFound/>,
            },
            {
                path: "*",
                element: <NotFound/>,
            },
        ],
    },
]);

export default AppRoutes;
