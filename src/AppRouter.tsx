import { RouterProvider } from "react-router-dom";
import AppRoutes from "./setup/routes";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress, Stack } from "@mui/material";

export const LoadingPage = (
    <Stack height="100vh" flexDirection="row" alignItems={'center'} justifyContent={'center'}>
        <CircularProgress />
    </Stack>
);

export default function AppRouter() {
    // const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

    // if (isLoading) {
    //     console.log('isLoading', isLoading);

    //     return LoadingPage;
    // };

    // if (!isAuthenticated) {
    //     console.log('isAuthenticated', isAuthenticated);
        
    //     loginWithRedirect();
    //     return LoadingPage;
    // }

    return <RouterProvider router={AppRoutes} />;
}