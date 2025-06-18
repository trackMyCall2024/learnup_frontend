import { Children } from 'react';
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
                ...sx,
                p: 1,
                cursor: 'pointer',
                height: '14px',
                width: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={onClick}
        >
            {children}
        </Box>
    );
};

export default CustomBtn;
