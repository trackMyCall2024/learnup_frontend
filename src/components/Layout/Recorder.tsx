import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Select, Option } from '@mui/joy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import BtnRecorder from '../atoms/BtnRecorder';
import { useSelector } from 'react-redux';
import { State } from '../../store/selector';

const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const global = useSelector((state: State) => state.global);
    console.log('global.recorder', global.recorder);

    const isOpen = global.recorder.isOpen;

    return (
        <Stack
            display={isOpen ? 'flex' : 'none'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            position="fixed"
            padding={2}
            bottom={0}
            mb={5}
            borderRadius={2}
            left="50%"
            zIndex={1000}
            sx={{
                transform: 'translateX(-50%)',
                height: '80px',
                width: '650px',
                overflowX: 'scroll',
                backgroundColor: (th) => th.palette.grey[900],
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            }}
        >
            <Stack
                height={20}
                width={'100%'}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                gap={1}
            >
                <Stack height={'15px'} width={'12px'}>
                    <img draggable={false} src="/icons/grey-analyze.svg" />
                </Stack>
                <Typography color={(th) => th.palette.grey[200]} fontWeight={800}>
                    Select a course and a chapter
                </Typography>
            </Stack>
            <Stack flexDirection={'row'} gap={2} height={'auto'} alignItems={'center'}>
                <Select
                    sx={{
                        backgroundColor: (th) => th.palette.grey?.[700],
                        color: (th) => th.palette.grey?.[600],
                        border: 'none',
                        flex: 1,
                        '&:hover': {
                            backgroundColor: (th) => th.palette.grey?.[800],
                        },
                    }}
                    placeholder="Select a course"
                    startDecorator={
                        <FontAwesomeIcon icon={faBook} fontSize="small" color="#919190" />
                    }
                >
                    <Option value={1}>course 1</Option>
                    <Option value={2}>course 2</Option>
                </Select>
                <Select
                    sx={{
                        backgroundColor: (th) => th.palette.grey?.[700],
                        color: (th) => th.palette.grey?.[600],
                        border: 'none',
                        flex: 1,
                        '&:hover': {
                            backgroundColor: (th) => th.palette.grey?.[800],
                        },
                    }}
                    placeholder="Select a chapter"
                    startDecorator={
                        <FontAwesomeIcon icon={faBook} fontSize="small" color="#919190" />
                    }
                >
                    <Option value={1}>chapter 1</Option>
                    <Option value={2}>chapter 2</Option>
                </Select>
                <BtnRecorder
                    isRecording={isRecording}
                    onClick={() => setIsRecording(!isRecording)}
                />
            </Stack>
        </Stack>
    );
};

export default Recorder;
