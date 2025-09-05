import { Button, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button as ButtonJoy } from '@mui/joy';

const NotFound = () => {
    const { handleBackToCourse } = useNavigation();

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            height="100%"
            sx={{
                backgroundColor: (theme) => theme.palette.background.default,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                404
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                Page not found
            </Typography>
            <ButtonJoy
                variant="soft"
                color="primary"
                sx={{ borderRadius: 5, my: 2 }}
                startDecorator={<FontAwesomeIcon icon={faRotateLeft} />}
                onClick={handleBackToCourse}
            >
                Back to courses
            </ButtonJoy>
        </Stack>
    );
};

export default NotFound;
