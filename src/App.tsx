import { Stack } from "@mui/material";
import Navbar from "./components/Layout/Navbar";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser, setAuthToken } from "./protocol/api";
import { useDispatch } from "react-redux";
import { useAuth0, User as UserAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { LoadingPage } from "./AppRouter";
import { setUser } from "./store/user";

function App() {
    const dispatch = useDispatch();

    const { isAuthenticated, isLoading, user, loginWithRedirect, getAccessTokenSilently } = useAuth0();
    const [userIsValid, setUserIsValid] = useState(false);

    // const token = useQuery({
    //     queryKey: ["set_token"],
    //     queryFn: () => getAccessTokenSilently(),
    //     enabled: !!user?.email,
    // });

    // useEffect(() => {
    //     if (token.data) {

    //         setUserIsValid(true);
    //         setAuthToken(token.data);
    //     }
    //   }, [token.data]);

    // const userData = useQuery({
    //     queryKey: ["get_user"],
    //     queryFn: () => getUser((user as UserAuth0)),
    //     enabled: isAuthenticated && !!token.data,
    // });

    // useEffect(() => {
    //     if (userData.data) {
    //         dispatch(setUser({ user: userData.data}));
    //     }

    // }, [userData]);

    // const isNotAuth = !userIsValid && !userData.data || userData.isLoading;
    
    if (false) {
        return LoadingPage;
    } else {

        return (
            <Stack height="100vh" flexDirection="row" overflow="hidden">
                <Navbar />
                <Stack
                    id="container"
                    flexDirection={"column"}
                    flex={1}
                    sx={{
                        backgroundColor: "grey.200",
                        padding: "35px",
                        overflow: "auto",
                    }}
                >
                    <Stack
                        flexDirection={"column"}
                        sx={{
                            flex: 1,
                            backgroundColor: (th) => th.palette.background.paper,
                            padding: "50px 50px 25px 50px",
                            borderRadius: 2,
                            boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 15px",
                            maxHeight: "-webkit-fill-available",
                        }}
                    >
                        <Outlet />
                    </Stack>
                </Stack>
            </Stack>
        );
    }
}

export default App;
