import { Box, Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Select, Option } from '@mui/joy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import BtnRecorder from '../atoms/BtnRecorder';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../store/selector';
import {
    setSelectedCourseId,
    setSelectedChapterId,
    setCourses,
    setChapters,
    setLoadingCourses,
    setLoadingChapters,
    resetRecordManager,
    RecordManagerState,
} from '../../store/recordManager';
import { createDirectory, createNote, createResume, getRows } from '../../protocol/api';
import { Row } from '../../Page/Course/interface.directory';
import { DirectoryType } from '../../Page/Course/interface.directory';
import { recordManagerSelector } from '../../store/selector';
import { useAudioRecorder, RecorderState } from '../../hooks/useAudioRecorder';
import { EllipsisText } from '../atoms/Typography';

const Recorder = () => {
    const INTERVAL_TIME = 1 * 60 * 1000;
    const dispatch = useDispatch();
    const {
        selectedCourseId,
        selectedChapterId,
        courses,
        chapters,
        isLoadingCourses,
        isLoadingChapters,
    } = useSelector<State, RecordManagerState>(recordManagerSelector);

    const user = useSelector((state: State) => state.user);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [sectionId, setSectionId] = useState<string | null>(null);

    // Audio recorder hook
    const {
        state: recorderState,
        startRecording,
        stopRecording,
        isStopped,
        setState,
        clearRecorder,
        setIsStopped,
        releaseMicrophone,
    } = useAudioRecorder({});

    const isRecording = recorderState === RecorderState.Recording;
    const canStartRecording = selectedCourseId && selectedChapterId && !isRecording;
    const canStopRecording = isRecording;

    const global = useSelector((state: State) => state.global);
    console.log('global.recorder', global.recorder);

    const isOpen = global.recorder.isOpen;

    // Load courses and chapters on component mount
    useEffect(() => {
        if (isOpen && user._id) {
            loadCourses();
        }
        if (selectedCourseId) {
            loadChapters(selectedCourseId);
        }
    }, [isOpen, user._id, selectedCourseId]);

    const loadCourses = async () => {
        try {
            dispatch(setLoadingCourses(true));
            const coursesData = await getRows(
                DirectoryType.Course,
                user._id,
                '',
                pagination.page,
                pagination.limit,
            );
            dispatch(setCourses(coursesData as Row[]));
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            dispatch(setLoadingCourses(false));
        }
    };

    const loadChapters = async (courseId: string) => {
        try {
            dispatch(setLoadingChapters(true));
            const chaptersData = await getRows(
                DirectoryType.Chapter,
                courseId,
                '',
                pagination.page,
                pagination.limit,
            );
            dispatch(setChapters(chaptersData as Row[]));
        } catch (error) {
            console.error('Error loading chapters:', error);
        } finally {
            dispatch(setLoadingChapters(false));
        }
    };

    const handleCourseChange = (courseId: string) => {
        dispatch(setSelectedCourseId(courseId));
    };

    const handleChapterChange = (chapterId: string) => {
        dispatch(setSelectedChapterId(chapterId));
    };

    const handleStartRecord = async (sectionId: string) => {
        await createResume(sectionId);
        await createNote(sectionId);
        startRecording({ sectionId });
        console.log('@@starting recording with sectionId:', sectionId);
    };

    const handleStopRecord = () => {
        stopRecording();
        console.log('@@stopping recording');
    };

    const handleLesson = async () => {
        try {
            let sectionIdToUse = sectionId ?? '';
            setState(RecorderState.Recording);

            if (sectionIdToUse) {
                handleStartRecord(sectionIdToUse);
                return;
            } else {
                const section = await createDirectory({
                    parentID: selectedChapterId || '',
                    name: 'new lesson',
                    logo: 'logo',
                    type: DirectoryType.Section,
                });
                sectionIdToUse = section.directory._id;
            }

            setSectionId(sectionIdToUse);
            handleStartRecord(sectionIdToUse);
        } catch (error) {
            console.error('Error creating section:', error);
            setState(RecorderState.Idle);
            clearRecorder();
        }
    };

    // STOP RECORDING IF INTERVAL_TIME IS REACHED
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRecording) {
            console.log('@@starting interval');
            interval = setInterval(() => {
                if (isRecording && !isStopped) {
                    handleStopRecord();
                }
            }, INTERVAL_TIME);
        }

        if (interval && recorderState === RecorderState.Stopped) {
            console.log('@@stopping interval');
            clearInterval(interval);
            clearRecorder();
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRecording, recorderState]);

    // RESTART RECORDING IF STOPPED
    useEffect(() => {
        if (isStopped) {
            handleLesson();
            setIsStopped(false);
        }
    }, [isStopped]);

    const handleRecordingClick = () => {
        if (canStartRecording) {
            handleLesson();
        } else if (canStopRecording) {
            setState(RecorderState.Stopped);
        }
    };

    const selectWidth = document.getElementById(`select-course`)?.clientWidth;

    console.log('@@selectWidth', selectWidth);

    const getSelect = (
        selectedId: string,
        data: Row[],
        disabled: boolean,
        dataType: 'course' | 'chapter',
        icon: IconDefinition,
        handleChange: (value: string) => void,
    ) => {
        return (
            <Select
                id={`select-${dataType}`}
                value={selectedId || ''}
                onChange={(event, value) => handleChange(value || '')}
                // disabled={disabled}
                sx={{
                    flex: 1,
                    backgroundColor: (th) => th.palette.grey?.[700],
                    color: (th) => th.palette.grey?.[600],
                    pointerEvents: disabled ? 'none' : 'auto',
                    border: 'none',
                    '&:hover': {
                        backgroundColor: (th) => th.palette.grey?.[800],
                    }
                }}
                placeholder={`select a ${dataType}...`}
                startDecorator={<FontAwesomeIcon icon={icon} fontSize="small" color="#919190" />}
            >
                {data?.map((item: Row) => (
                    <Option
                        key={item._id}
                        value={item._id}
                        disabled={disabled}
                        sx={{
                            // backgroundColor: (th) => th.palette.grey?.[700],
                            color: (th) => th.palette.grey?.[600],
                            fontSize: '12px',
                            minHeight: '35px',
                            maxHeight: '35px',
                            // maxWidth: `${selectWidth}px`,
                        }}
                    >
                        <EllipsisText>{item.name}</EllipsisText>
                    </Option>
                ))}
            </Select>
        );
    };

    return (
        <Stack
            display={isOpen ? 'flex' : 'none'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            position="fixed"
            padding={2}
            bottom={0}
            mb={3}
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
                {getSelect(
                    selectedCourseId || '',
                    courses,
                    isLoadingCourses,
                    'course',
                    faBook,
                    handleCourseChange,
                )}
                {getSelect(
                    selectedChapterId || '',
                    chapters,
                    !selectedCourseId || isLoadingChapters,
                    'chapter',
                    faBook,
                    handleChapterChange,
                )}
                <BtnRecorder
                    isRecording={isRecording}
                    onClick={handleRecordingClick}
                    disabled={!selectedCourseId || !selectedChapterId}
                />
            </Stack>
        </Stack>
    );
};

export default Recorder;
