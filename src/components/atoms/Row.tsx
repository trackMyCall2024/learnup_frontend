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
import { setCurrentHistory } from '../../store/directory';

export enum RowType {
    History = 'history',
    List = 'list',
}

interface RowProps {
    rowType: RowType;
    row: RowInterface;
}

const Row = ({ rowType, row }: RowProps) => {
    const dispatch = useDispatch();
    const global = useSelector<State, GlobalState>(globalSelector);
    const historyType = global.page.current.title as string;
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: rowType === RowType.List ? 'space-between' : 'flex-start',
                width: rowType === RowType.List ? '-webkit-fill-available' : '300px',
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
                        isOpen: true,
                    }),
                    dispatch(
                        setCurrentHistory({
                            type: historyType,
                            data: row,
                        }),
                    ),
                );
                slideHalfPageToLeft();
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
                <Stack
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    gap={2}
                >
                    <FontAwesomeIcon icon={faShareNodes} size="sm" />
                    <FontAwesomeIcon icon={faArrowDown} size="sm" />
                </Stack>
            </RenderWhen>
        </Box>
    );
};

export default Row;

function getNextPage(currentPage: Page): Page | null {
    switch (currentPage) {
        case Page.Courses:
            return Page.Chapters;

        case Page.Chapters:
            return Page.Sections;

        case Page.Sections:
            return Page.Chapters;

        default:
            return null;
    }
}
