import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalState, setIsHalfPageIsOpen, setNextPage } from '../../store/global';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../interface.global';
import { directorySelector, globalSelector, State, userSelector } from '../../store/selector';
import Directory from './Directory';
import Header from '../../components/Layout/Header';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CurrentItemId, DirectoryState, setCurrentItem } from '../../store/directory';
import { putHistory } from '../../protocol/api';
import { UserState } from '../../store/user';
import { usePage } from '../../hooks/usePage';
import { Dispatch } from 'react';

export function slideHalfPageToLeft(dispatch: Dispatch<any>) {
    dispatch(setIsHalfPageIsOpen(false));   
    gsap.to('#halfPage', {
        translateX: '0%',
        duration: 1,
    });
}

const HalfPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector<State, UserState>(userSelector);
    const global = useSelector<State, GlobalState>(globalSelector);
    const directory = useSelector<State, DirectoryState>(directorySelector);
    const history = directory.history.current;

    const queryClient = useQueryClient();
    const { handleGoToNext } = usePage();

    const handlePutHistory = useMutation({
        mutationFn: () =>
            putHistory(history?.type as string, history?.data._id as string, user._id),
    });

    function slideHalfPageToRight() {
        dispatch(setIsHalfPageIsOpen(false));
        console.log('slideHalfPageToRight');

        gsap.to('#halfPage', {
            translateX: '100%',
            duration: 0.4,
            onComplete: () => {
                dispatch(setNextPage({ _id: '', title: null, isOpen: false }));
            },
        });
    }

    const onEnd = () => {
        const nextPage = `${global.page.next.title}` as Page;
        navigate(`${nextPage}/${global.page.next._id}`);
        handlePutHistory.mutate();
    };

    return (
        <Stack
            width={'100%'}
            display={'flex'}
            sx={{ zIndex: 10 }}
            position={'absolute'}
            minHeight={'-webkit-fill-available'}
            flexDirection={'row'}
        >
            <Stack
                minHeight={'-webkit-fill-available'}
                flex={1}
                onClick={slideHalfPageToRight}
            ></Stack>
            <Stack
                id={'halfPage'}
                display={'flex'}
                minHeight={'-webkit-fill-available'}
                flex={1}
                right={0}
                sx={{
                    zIndex: 10,
                    border: 'none',
                    borderLeft: (theme) => `1px solid ${theme.palette.primary[500]}`,
                    backgroundColor: (th) => th.palette.background.paper,
                }}
                onClick={() => handleGoToNext(onEnd)}
            >
                <Directory
                    halfPageIsOpen={true}
                    idFromHalfPage={global.page.next._id}
                    headerFromHalfPage={
                        <Header titleFromHalfPage={global.page.next.title as Page} isHalfPageIsOpen={true} />
                    }
                />
            </Stack>
        </Stack>
    );
};

export default HalfPage;
