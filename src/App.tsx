import { Box, Stack } from "@mui/material";
import Navbar from "./components/Layout/Navbar";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser, setAuthToken } from "./protocol/api";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0, User as UserAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { LoadingPage } from "./AppRouter";
import { setUser } from "./store/user";
import { H1 } from "./components/atoms/Typography";
import { globalSelector, State } from "./store/selector";
import { GlobalState } from "./store/global";

function App() {
    const global = useSelector<State, GlobalState>(globalSelector);

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
                    overflow={'auto'}
                >
                    <Stack
                        flexDirection={"column"}
                        sx={{
                            flex: 1,
                            backgroundColor: (th) => th.palette.background.paper,
                            maxHeight: "-webkit-fill-available",
                        }}
                    >
                        <Stack 
                            maxWidth={'100%'} 
                            sx={{
                                padding: "10px 30px",
                                borderBottom: (th) => `0.5px solid ${th.palette.grey['400']}`
                            }}
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={"space-between"}
                            alignItems={'center'}
                        >
                            <H1>{global.page.title}</H1>
                            <Box height={75} width={75}>
                                <img src="logo/logo.JPG" height={'100%'} draggable={false} />
                            </Box>
                        </Stack>
                        <Stack 
                            sx={{
                                padding: "30px",
                            }}
                        >
                            <Outlet />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        );
    }
}

export default App;
