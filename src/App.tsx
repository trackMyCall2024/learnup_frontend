import { Box, Button, Stack, Typography } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser, setAuthToken } from './protocol/api';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0, User as UserAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { LoadingPage } from './AppRouter';
import { setUser } from './store/user';
import { H1 } from './components/atoms/Typography';
import HalfPage from './Page/Course/HalfPage';
import Header from './components/Layout/Header';
import RenderWhen from './components/atoms/RenderWhen';
import { globalSelector, recordManagerSelector, State } from './store/selector';
import { GlobalState } from './store/global';
import CourseChapterModal from './components/CourseChapterModal';
import { RecordManagerState, setModalOpen } from './store/recordManager';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Select, Option } from '@mui/joy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import Recorder from './components/Layout/Recorder';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import DeleteModal from './components/Layout/DeleteModal';

function App() {
    const { isAuthenticated, isLoading, user, loginWithRedirect, getAccessTokenSilently } =
        useAuth0();
    const [userIsValid, setUserIsValid] = useState(false);
    const global = useSelector<State, GlobalState>(globalSelector);
    const dispatch = useDispatch();
    const isModalOpen = useSelector<State, RecordManagerState>(recordManagerSelector).isModalOpen;

    // Activer les raccourcis clavier
    useKeyboardShortcuts();

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
            <>
                <Stack height="100vh" flexDirection="row" overflow="hidden" minHeight={'600px'}>
                    <RenderWhen if={global.page.next.isOpen}>
                        <HalfPage />
                    </RenderWhen>
                    <Navbar />
                    <Stack id="container" flexDirection={'column'} flex={1} overflow={'auto'}>
                        <Stack
                            flexDirection={'column'}
                            minWidth={'900px'}
                            sx={{
                                flex: 1,
                                backgroundColor: (th) => th.palette.background.paper,
                                maxHeight: '-webkit-fill-available',
                                overflowX: 'scroll',
                            }}
                        >
                            <RenderWhen if={!global.lesson.isZoomed}>
                                <Header />
                            </RenderWhen>
                            <Stack padding={'30px'} flex={1}>
                                <Outlet />
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>

                {isModalOpen && (
                    <CourseChapterModal
                        open={isModalOpen}
                        onClose={() => dispatch(setModalOpen(false))}
                    />
                )}
                <RenderWhen if={global.deleteModal.isOpen}>
                    <DeleteModal />
                </RenderWhen>
                <Recorder />
            </>
        );
    }
}

export default App;
