import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    CircularProgress,
    Typography,
    Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    setSelectedCourseId,
    setSelectedChapterId,
    setCourses,
    setChapters,
    setLoadingCourses,
    setLoadingChapters,
    resetRecordManager,
    RecordManagerState,
} from '../store/recordManager';
import { createDirectory, createNote, createResume, getRows } from '../protocol/api';
import { Row } from '../Page/Course/interface.directory';
import { DirectoryType } from '../Page/Course/interface.directory';
import { recordManagerSelector, State } from '../store/selector';
import { useAudioRecorder, RecorderState } from '../hooks/useAudioRecorder';

interface CourseChapterModalProps {
    open: boolean;
    onClose: () => void;
}

const CourseChapterModal: React.FC<CourseChapterModalProps> = ({ open, onClose }) => {
    const INTERVAL_TIME = 5 * 60 * 1000;
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

    // useEffect(() => {
    //     releaseMicrophone();
    //     console.log('@@releasing microphone');
    //     return () => {
    //         releaseMicrophone();
    //     };
    // }, []);

    // Load courses and chapters on component mount
    useEffect(() => {
        if (open && user._id) {
            loadCourses();
        }
        if (selectedCourseId) {
            loadChapters(selectedCourseId);
        }
    }, [open, user._id, selectedCourseId]);

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

    const handleClose = () => {
        dispatch(resetRecordManager());
        setSectionId(null);
        onClose();
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

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Select Course and Chapter</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {/* Course Selection */}
                    <FormControl fullWidth>
                        <InputLabel id="course-select-label">Course</InputLabel>
                        <Select
                            labelId="course-select-label"
                            id="course-select"
                            value={selectedCourseId || ''}
                            label="Course"
                            onChange={(e) => handleCourseChange(e.target.value)}
                            disabled={isLoadingCourses}
                        >
                            {isLoadingCourses ? (
                                <MenuItem disabled>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Loading courses...
                                </MenuItem>
                            ) : courses?.length === 0 ? (
                                <MenuItem disabled>No courses available</MenuItem>
                            ) : (
                                courses?.map((course: Row) => (
                                    <MenuItem key={course._id} value={course._id}>
                                        {course.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    {/* Chapter Selection */}
                    <FormControl fullWidth>
                        <InputLabel id="chapter-select-label">Chapter</InputLabel>
                        <Select
                            labelId="chapter-select-label"
                            id="chapter-select"
                            value={selectedChapterId || ''}
                            label="Chapter"
                            onChange={(e) => handleChapterChange(e.target.value)}
                            disabled={!selectedCourseId || isLoadingChapters}
                        >
                            {!selectedCourseId ? (
                                <MenuItem disabled>Please select a course first</MenuItem>
                            ) : isLoadingChapters ? (
                                <MenuItem disabled>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Loading chapters...
                                </MenuItem>
                            ) : chapters?.length === 0 ? (
                                <MenuItem disabled>No chapters available for this course</MenuItem>
                            ) : (
                                chapters.map((chapter: Row) => (
                                    <MenuItem key={chapter._id} value={chapter._id}>
                                        {chapter.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    {/* Info Text */}
                    {selectedCourseId && selectedChapterId && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic' }}
                        >
                            {isRecording
                                ? 'Recording in progress...'
                                : 'Ready to start recording for the selected course and chapter.'}
                        </Typography>
                    )}

                    {/* Recording Status Indicator */}
                    {isRecording && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 2,
                                bgcolor: 'error.light',
                                color: 'error.contrastText',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'error.main',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: 'error.main',
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            />
                            <Typography variant="body2" fontWeight="medium">
                                Recording in progress...
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>

                {/* Start/Stop Button */}
                <Button
                    onClick={
                        canStartRecording
                            ? handleLesson
                            : () => {
                                  setState(RecorderState.Stopped);
                              }
                    }
                    variant={canStartRecording ? 'contained' : 'outlined'}
                    color={canStartRecording ? 'primary' : 'error'}
                    disabled={!selectedCourseId || !selectedChapterId}
                >
                    {canStartRecording ? 'Start Recording' : 'Stop Recording'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourseChapterModal;
