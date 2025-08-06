import { Row as RowInterface } from '../../Page/Course/interface.directory';
import { Stack } from '@mui/material';
import Box from './Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChess } from '@fortawesome/free-solid-svg-icons';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Text } from './Typography';
import { GlobalState, RowPage, setNextPage } from '../../store/global';
import { slideHalfPageToLeft } from '../../Page/Course/HalfPage';
import { useDispatch, useSelector } from 'react-redux';
import { Page } from '../../interface.global';
import { globalSelector, State } from '../../store/selector';
import RenderWhen from './RenderWhen';
import { setCurrentHistory, setCurrentItem } from '../../store/directory';
import { useNavigate } from 'react-router-dom';
import { getNextPage, usePage } from '../../hooks/usePage';
import FileAction from './FileActions';

export enum RowType {
    History = 'history',
    List = 'list',
}

interface RowProps {
    rowType: RowType;
    row: RowInterface;
}

export enum HistoryType {
    Course = 'courses',
    Chapter = 'chapters',
    Section = 'sections',
}

const Row = ({ rowType, row }: RowProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleGoToNext } = usePage();

    const global = useSelector<State, GlobalState>(globalSelector);
    const historyType = global.page.current.title as string;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: rowType === RowType.List ? 'space-between' : 'flex-start',
                width: rowType === RowType.List ? '-webkit-fill-available' : '30%',
                cursor: 'pointer',
                ':hover': {
                    backgroundColor: 'rgba(250, 250, 250, 0.7)',
                },
            }}
            onClick={() => {
                dispatch(
                    setNextPage({
                        _id: row._id,
                        title: getNextPage(global.page.current.title) as RowPage,
                        isOpen: global.page.current.title === Page.Sections ? false : true,
                    }),
                    dispatch(
                        setCurrentHistory({
                            type: historyType,
                            data: row,
                        }),
                    ),
                    dispatch(
                        setCurrentItem({
                            [global.page.current.title]: row._id,
                        }),
                    ),
                );
                if (global.page.current.title === Page.Sections) {
                    handleGoToNext(() => navigate(`/section/${row._id}`));
                } else {
                    slideHalfPageToLeft();
                }
            }}
        >
            <Stack
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={2}
            >
                <FontAwesomeIcon icon={faChess} />
                <Text>{row.name}</Text>
            </Stack>
            <RenderWhen if={rowType === RowType.List}>
                <FileAction size={'xs'} />
            </RenderWhen>
        </Box>
    );
};

export default Row;
