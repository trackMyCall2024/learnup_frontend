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
    setModalOpen,
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

    // Audio recorder hook
    const {
        state: recorderState,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
    } = useAudioRecorder({});

    // Load courses on component mount
    useEffect(() => {
        if (open && user._id) {
            loadCourses();
        }
    }, [open, user._id]);

    // Load chapters when course selection changes
    useEffect(() => {
        if (selectedCourseId) {
            loadChapters(selectedCourseId);
        }
    }, [selectedCourseId]);

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

    const handleStartRecord = async () => {
        if (recorderState === RecorderState.Recording) {
            // Si on est en train d'enregistrer, on arrête
            stopRecording();
        } else {
            // Sinon on démarre l'enregistrement
            // Create section 
            const section = await createDirectory({
                parentID: selectedChapterId || '',
                name: 'new section',
                logo: 'logo',
                type: DirectoryType.Section,
            });

            // create resume
            await createResume(section._id);
            // create note
            await createNote(section._id);

            console.log('@@section', section);

            if (section._id) {
                startRecording(section._id);
            }
        }
    };

    const handlePauseResume = () => {
        if (recorderState === RecorderState.Recording) {
            pauseRecording();
        } else if (recorderState === RecorderState.Paused) {
            resumeRecording();
        }
    };

    const isRecording = recorderState === RecorderState.Recording;
    const isPaused = recorderState === RecorderState.Paused;
    const canStartRecording = selectedCourseId && selectedChapterId && !isRecording && !isPaused;
    const canStopRecording = isRecording || isPaused;
    const canPauseResume = isRecording || isPaused;

    const handleClose = () => {
        dispatch(resetRecordManager());
        onClose();
    };

    const isStartRecordDisabled = !selectedCourseId || !selectedChapterId;

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
                                : isPaused
                                  ? 'Recording paused...'
                                  : 'Ready to start recording for the selected course and chapter.'}
                        </Typography>
                    )}

                    {/* Recording Status Indicator */}
                    {(isRecording || isPaused) && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 2,
                                bgcolor: isRecording ? 'error.light' : 'warning.light',
                                color: isRecording ? 'error.contrastText' : 'warning.contrastText',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: isRecording ? 'error.main' : 'warning.main',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: isRecording ? 'error.main' : 'warning.main',
                                    animation: isRecording
                                        ? 'pulse 1.5s ease-in-out infinite'
                                        : 'none',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            />
                            <Typography variant="body2" fontWeight="medium">
                                {isRecording ? 'Recording in progress...' : 'Recording paused...'}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>

                {/* Pause/Resume Button */}
                {canPauseResume && (
                    <Button
                        onClick={handlePauseResume}
                        variant="outlined"
                        color="warning"
                        disabled={!canPauseResume}
                    >
                        {isPaused ? 'Resume Recording' : 'Pause Recording'}
                    </Button>
                )}

                {/* Start/Stop Button */}
                <Button
                    onClick={handleStartRecord}
                    variant={canStopRecording ? 'outlined' : 'contained'}
                    color={canStopRecording ? 'error' : 'primary'}
                    disabled={!canStartRecording && !canStopRecording}
                >
                    {canStopRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourseChapterModal;
