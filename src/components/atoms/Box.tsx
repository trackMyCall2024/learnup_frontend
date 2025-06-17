import { Stack, SxProps, Theme } from '@mui/material';
import React from 'react';

interface BoxProps {
    children?: React.ReactNode;
    sx?: SxProps<Theme>;
    onClick?: () => void;
}

const Box = ({ children, sx, onClick }: BoxProps) => (
    <Stack
        width={'auto'}
        height={'auto'}
        py={1.5}
        px={2.5}
        borderRadius={2}
        sx={{ ...sx, border: (th) => `1px solid ${th.palette.primary['500']}` }}
        onClick={onClick}
    >
        {children}
    </Stack>
);

export default Box;
