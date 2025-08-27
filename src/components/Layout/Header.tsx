import { Box, Stack, Button } from '@mui/material';
import { H1 } from '../atoms/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { globalSelector, State } from '../../store/selector';
import { GlobalState } from '../../store/global';
import { Page } from '../../interface.global';
import { getCapitalizeCase } from '../../utils/utils';
import { setModalOpen } from '../../store/recordManager';
import BtnExpandNavbar from '../atoms/BtnExpandNavbar';
import RenderWhen from '../atoms/RenderWhen';
import gsap from 'gsap';
import { useEffect } from 'react';

interface HeaderProps {
    titleFromHalfPage?: Page;
    isHalfPageIsOpen?: boolean;
}

const Header = ({ titleFromHalfPage, isHalfPageIsOpen }: HeaderProps) => {
    const global = useSelector<State, GlobalState>(globalSelector);
    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch(setModalOpen(true));
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

    return (
        <Stack
            minHeight={75}
            maxWidth={'100%'}
            sx={{
                padding: '10px 30px',
                borderBottom: (th) => `0.5px solid ${th.palette.grey['400']}`,
            }}
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
        >
            <RenderWhen if={!isHalfPageIsOpen}>
                <BtnExpandNavbar isHeader={true} />
            </RenderWhen>
            <H1>
                {titleFromHalfPage
                    ? getCapitalizeCase(titleFromHalfPage as string)
                    : getCapitalizeCase(global.page.current.title)}
            </H1>
            {/* <Stack direction="row" spacing={2} alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    sx={{ visibility: titleFromHalfPage ? 'hidden' : 'visible' }}
                >
                    Start Recording
                </Button>
                <Box
                    height={75}
                    width={75}
                    sx={{ visibility: titleFromHalfPage ? 'hidden' : 'visible' }}
                >
                    <img src="https://i.ibb.co/qLdPSqsT/logo.jpg" height={'100%'} draggable={false} />
                </Box>
            </Stack> */}
        </Stack>
    );
};

export default Header;
