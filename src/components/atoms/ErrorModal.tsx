import { useDispatch, useSelector } from 'react-redux';
import {
    GlobalState,
    setDeleteModalClose,
    setDeleteModalIsLoading,
    setErrorModalClose,
} from '../../store/global';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { Button as ButtonJoy } from '@mui/joy';
import { faCircleExclamation, faHandMiddleFinger, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef } from 'react';
import { useNavigation } from '../../hooks/useNavigation';

const ErrorModal = () => {
    const global = useSelector((state: { global: GlobalState }) => state.global);
    const dispatch = useDispatch();
    const { navigateBack, handleBackToCourse } = useNavigation();


    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(setErrorModalClose());
            handleBackToCourse();
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Modal open={global.errorModal.isOpen}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '500px',
                    bgcolor: (theme) => theme.palette.background.default,
                    boxShadow: 24,
                    p: 4,
                }}
                borderRadius={2}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        color: (theme) => theme.palette.white.main,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 'bold',
                        mb: 1
                    }}
                >
                    <FontAwesomeIcon icon={faCircleExclamation} size="sm" />
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{ color: (theme) => theme.palette.white.main }}
                    >
                        {global.errorModal.title}
                    </Typography>
                </Typography>
                <Typography
                    variant="body1"
                    component="p"
                    sx={{ color: (theme) => theme.palette.white.main }}
                >
                    {global.errorModal.message}
                </Typography>
            </Box>
        </Modal>
    );
};

export default ErrorModal;
