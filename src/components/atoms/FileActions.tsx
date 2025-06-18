import { faArrowDown, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Stack } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import Box from './Box';

interface FileActionProps {
    size?: 'sm' | 'xs';
}

const FileAction = ({ size }: FileActionProps) => {
    return (
        <Stack
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={2}
        >
            <Box
                sx={{
                    p: 1,
                    cursor: 'pointer',
                    height: '14px',
                    width: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ShareIcon sx={{ fontSize: size === 'xs' ? '12px' : '14px' }} />
            </Box>
            <Box
                sx={{
                    p: 1,
                    cursor: 'pointer',
                    height: '14px',
                    width: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FontAwesomeIcon icon={faArrowDown} fontSize={size === 'xs' ? '12px' : '14px'} />
            </Box>
        </Stack>
    );
};

export default FileAction;
