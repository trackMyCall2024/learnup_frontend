import { useDispatch, useSelector } from 'react-redux';
import { GlobalState, setDeleteModalClose, setDeleteModalIsLoading } from '../../store/global';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { Button as ButtonJoy } from '@mui/joy';
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteDirectory } from '../../protocol/api';
import { useNavigation } from '../../hooks/useNavigation';

const DeleteModal = () => {
    const global = useSelector((state: { global: GlobalState }) => state.global);
    const dispatch = useDispatch();

    const { navigateBack } = useNavigation();

    const handleDelete = async () => {
        dispatch(setDeleteModalIsLoading(true));
        await deleteDirectory(global.deleteModal.content._id);
        dispatch(setDeleteModalIsLoading(false));
        dispatch(setDeleteModalClose());
        navigateBack();
    };

    const handleCancel = () => {
        dispatch(setDeleteModalClose());
    };
    return (
        <Modal
            open={global.deleteModal.isOpen}
            onClose={() => {
                if (global.deleteModal.isLoading) {
                    return;
                }
                dispatch(setDeleteModalClose());
            }}
        >
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
                    }}
                >
                    Are you sure you ?
                </Typography>
                <Typography sx={{ mt: 2, color: (theme) => theme.palette.white.main }}>
                    This action cannot be undone. Do you want to delete the{' '}
                    {global.deleteModal.content.type} {global.deleteModal.content.name} ?
                </Typography>
                <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                    <ButtonJoy
                        variant="solid"
                        color="danger"
                        sx={{ borderRadius: 5 }}
                        startDecorator={<FontAwesomeIcon icon={faTrash} />}
                        loading={global.deleteModal.isLoading}
                        onClick={handleDelete}
                    >
                        Delete
                    </ButtonJoy>
                    <ButtonJoy
                        variant="soft"
                        color="primary"
                        sx={{ borderRadius: 5 }}
                        startDecorator={<FontAwesomeIcon icon={faXmark} />}
                        onClick={handleCancel}
                    >
                        Cancel
                    </ButtonJoy>
                </Stack>
            </Box>
        </Modal>
    );
};

export default DeleteModal;
