import { Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

const BtnRecorder = ({
    onClick,
    isRecording,
    disabled,
}: {
    onClick: () => void;
    isRecording: boolean;
    disabled: boolean;
}) => (
    <Button
        size="small"
        color="info"
        variant="contained"
        startIcon={isRecording ? <StopIcon /> : <PlayArrowIcon />}
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '14px',
            width: '145px',
            backgroundColor: (th) => (isRecording ? th.palette.error?.main : th.palette.white?.main),
            color: (th) => (isRecording ? th.palette.white?.main : th.palette.text.primary),
            height: '100%',
            '&:hover': {
                backgroundColor: (th) => (isRecording ? th.palette.error?.dark : th.palette.white?.dark),
            },
        }}
        onClick={onClick}
        disabled={disabled}
    >
        {isRecording ? 'Stop recording' : 'Start recording'}
    </Button>
);

export default BtnRecorder;
