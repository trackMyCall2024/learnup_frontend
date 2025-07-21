import { faArrowDown, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Stack } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CustomBtn from './CustomBtn';

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
            <CustomBtn
                sx={{
                    p: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ShareIcon
                    sx={{ fontSize: size === 'xs' ? '12px' : '14px', height: 14, width: 14 }}
                />
            </CustomBtn>
            <CustomBtn>
                <FontAwesomeIcon
                    icon={faArrowDown}
                    fontSize={size === 'xs' ? '12px' : '14px'}
                    style={{ height: 14, width: 14 }}
                />
            </CustomBtn>
        </Stack>
    );
};

export default FileAction;
