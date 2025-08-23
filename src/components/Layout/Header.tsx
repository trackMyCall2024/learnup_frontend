import { Box, Stack, Button } from '@mui/material';
import { H1 } from '../atoms/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { globalSelector, State } from '../../store/selector';
import { GlobalState } from '../../store/global';
import { Page } from '../../interface.global';
import { getCapitalizeCase } from '../../utils/utils';
import { setModalOpen } from '../../store/recordManager';

interface HeaderProps {
    titleFromHalfPage?: Page;
}

const Header = ({ titleFromHalfPage }: HeaderProps) => {
    const global = useSelector<State, GlobalState>(globalSelector);
    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch(setModalOpen(true));
    };

    return (
        <Stack
            maxWidth={'100%'}
            sx={{
                padding: '10px 30px',
                borderBottom: (th) => `0.5px solid ${th.palette.grey['400']}`,
            }}
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
        >
            <H1>
                {titleFromHalfPage
                    ? getCapitalizeCase(titleFromHalfPage as string)
                    : getCapitalizeCase(global.page.current.title)}
            </H1>
            <Stack direction="row" spacing={2} alignItems="center">
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
            </Stack>
        </Stack>
    );
};

export default Header;
