import Box from './Box';
import { H5 } from './Typography';
import { SxProps, Theme } from '@mui/material';

interface ToolBoxProps {
    title: string;
    icon?: JSX.Element;
    children: React.ReactNode;
    sx?: SxProps<Theme>;
    disabled?: boolean;
    onClick?: () => void;
}

const ToolBox = ({ title, icon, children, sx, disabled, onClick }: ToolBoxProps) => {
    return (
        <Box
            sx={{
                ...sx,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? 'none' : 'initial',
                filter: disabled ? 'grayscale(50%)' : 'initial',
            }}
            onClick={onClick}
        >
            <H5 fontWeight={'600'} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon} {title}
            </H5>
            {children}
        </Box>
    );
};

export default ToolBox;
