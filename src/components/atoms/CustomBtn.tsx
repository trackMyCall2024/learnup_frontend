import Box from './Box';
import { SxProps, Theme } from '@mui/material';

interface CustomBtnProps {
    children?: React.ReactNode;
    sx?: SxProps<Theme>;
    onClick?: () => void;
}

const CustomBtn = ({ children, sx, onClick }: CustomBtnProps) => {
    return (
        <Box
            sx={{
                p: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx,
            }}
            onClick={onClick}
        >
            {children}
        </Box>
    );
};

export default CustomBtn;
