import { Stack } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { LoadingPage } from './AppRouter';
import HalfPage from './Page/Course/HalfPage';
import Header from './components/Layout/Header';
import RenderWhen from './components/atoms/RenderWhen';
import { globalSelector, recordManagerSelector, State } from './store/selector';
import { GlobalState } from './store/global';
import { RecordManagerState } from './store/recordManager';
import Recorder from './components/Layout/Recorder';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import DeleteModal from './components/Layout/DeleteModal';
import { useNavigation } from './hooks/useNavigation';
import ErrorModal from './components/atoms/ErrorModal';
import { getCurrentPageFromURL } from './utils/utils';
import { Page } from './interface.global';

function App() {
    const { isAuthenticated, isLoading, user, loginWithRedirect, getAccessTokenSilently } =
        useAuth0();
    const [userIsValid, setUserIsValid] = useState(false);
    const global = useSelector<State, GlobalState>(globalSelector);
    const dispatch = useDispatch();
    const isModalOpen = useSelector<State, RecordManagerState>(recordManagerSelector).isModalOpen;
    const location = useLocation();
    const currentPage = getCurrentPageFromURL(location.pathname);

    // Activer les raccourcis clavier
    useKeyboardShortcuts();

    // Activer la synchronisation de navigation
    useNavigation();

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
                <RenderWhen if={global.deleteModal.isOpen}>
                    <DeleteModal />
                </RenderWhen>
                {/* <RenderWhen if={global.errorModal.isOpen && currentPage !== Page.Courses}>
                    <ErrorModal />
                </RenderWhen> */}
                <RenderWhen if={global.recorder.isOpen}>
                    <Recorder />
                </RenderWhen>
            </>
        );
    }
}

export default App;
