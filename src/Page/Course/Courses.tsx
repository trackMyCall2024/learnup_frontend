import { Stack } from '@mui/material';
import react from 'react';
import { Text } from '../../components/atoms/Typography';
import { useSelector } from 'react-redux';
import { globalSelector, State } from '../../store/selector';
import { GlobalState } from '../../store/global';

const Courses = () => {
    const global = useSelector<State, GlobalState>(globalSelector);

    return (
        <Stack>
            <Text>Text</Text>
        </Stack>
    );
};

export default Courses;
