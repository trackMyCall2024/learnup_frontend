import { Box, Stack, Button } from '@mui/material';
import { H1 } from '../atoms/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { directorySelector, globalSelector, State, userSelector } from '../../store/selector';
import { GlobalState, setIsHalfPageIsOpen } from '../../store/global';
import { Page } from '../../interface.global';
import { getCapitalizeCase } from '../../utils/utils';
import { faAnglesLeft, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { usePage } from '../../hooks/usePage';
import { setModalOpen } from '../../store/recordManager';
import BtnExpandNavbar from '../atoms/BtnExpandNavbar';
import RenderWhen from '../atoms/RenderWhen';
import gsap from 'gsap';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { putHistory } from '../../protocol/api';
import { useMutation } from '@tanstack/react-query';
import { UserState } from '../../store/user';
import { DirectoryState } from '../../store/directory';
import CustomMenu from '../atoms/CustomMenu';

interface HeaderProps {
    titleFromHalfPage?: Page;
    isHalfPageIsOpen?: boolean;
}

const Header = ({ titleFromHalfPage, isHalfPageIsOpen }: HeaderProps) => {
    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);
    const directory = useSelector<State, DirectoryState>(directorySelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleGoToNext, currentPage } = usePage();

    const history = directory.history.current;

    const handlePutHistory = useMutation({
        mutationFn: () =>
            putHistory(history?.type as string, history?.data._id as string, user._id),
    });

    const onEnd = () => {
        const nextPage = `${global.page.next.title}` as Page;
        navigate(`${nextPage}/${global.page.next._id}`);
        handlePutHistory.mutate();
    };

    useEffect(() => {
        if (global.navbar.isEnlarged) {
            gsap.to('#btn-expand-navbar-header-container', {
                width: '0px',
                overflow: 'hidden',
                duration: 0.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set('#btn-expand-navbar-header', { display: 'none' });
                },
            });
        } else {
            gsap.to('#btn-expand-navbar-header-container', {
                width: '20px',
                overflow: 'visible',
                duration: 0.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set('#btn-expand-navbar-header', { display: 'flex' });
                },
            });
        }
    }, [global.navbar.isEnlarged]);

    console.log(
        '@@Front - currentPage',
        currentPage,
        currentPage === Page.Chapters || currentPage === Page.Sections || currentPage === Page.Section,
    );

    return (
        <Stack
            minHeight={75}
            maxWidth={'100%'}
            sx={{
                padding: '10px 30px',
                borderBottom: (th) => `0.5px solid ${th.palette.grey['400']}`,
                position: 'relative',
            }}
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
        >
            <RenderWhen
                if={
                    currentPage === Page.Chapters ||
                    currentPage === Page.Sections ||
                    currentPage === Page.Section
                }
            >
                <CustomMenu />
            </RenderWhen>
            <RenderWhen if={!isHalfPageIsOpen}>
                <BtnExpandNavbar isHeader={true} />
            </RenderWhen>
            <RenderWhen if={isHalfPageIsOpen}>
                <Button
                    color="info"
                    variant="contained"
                    startIcon={
                        <FontAwesomeIcon
                            icon={faAnglesLeft}
                            size="sm"
                            style={{
                                marginRight: '0px',
                                marginLeft: '10px',
                                fontSize: '14px',
                            }}
                        />
                    }
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: '40px',
                        minHeight: '25px',
                        padding: 0,
                        borderRadius: 2,
                        marginRight: 2,
                    }}
                    onClick={() => {
                        dispatch(setIsHalfPageIsOpen(false));
                        handleGoToNext(onEnd);
                    }}
                ></Button>
            </RenderWhen>
            <H1>
                {titleFromHalfPage
                    ? getCapitalizeCase(titleFromHalfPage as string)
                    : getCapitalizeCase(currentPage)}
            </H1>
        </Stack>
    );
};

export default Header;
