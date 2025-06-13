import { styled } from '@mui/material';
import { Typography } from '@mui/joy';

const Ellipsis = styled(Typography)(({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}));

export default Ellipsis;
