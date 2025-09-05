import { Box, Stack } from '@mui/material';
import { H3 } from './Typography';
import { Row as RowInterface } from '../../Page/Course/interface.directory';
import Row, { RowType } from './Row';
import RenderWhen from './RenderWhen';
import { useSelector } from 'react-redux';
import { globalSelector, State } from '../../store/selector';
import { GlobalState } from '../../store/global';
import { Page } from '../../interface.global';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPageName } from '../../utils/utils';

interface RowProps {
    headerTitle: string;
    rowsData: RowInterface[];
    currentPage?: Page;
    handkeCreateRow?: () => void;
}

const Rows = ({ currentPage, headerTitle, rowsData, handkeCreateRow }: RowProps) => {
    const global = useSelector<State, GlobalState>(globalSelector);
    const isHistoryType = headerTitle === 'History';

    const rowList = (
        <Stack display={'flex'} flexDirection={'column'} gap={1}>
            {rowsData?.map((row, i) => <Row key={i} row={row} rowType={RowType.List} />)}
            {/* Add a new row */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'fit-content',
                    // height: '30px',
                    p: 1,
                    border: '1px solid #e0e0e0',
                    color: (th) => th.palette.grey[300],
                    fontSize: '14px',
                    cursor: global.page.next.isOpen ? 'default' : 'pointer',
                    borderRadius: 2,
                    ':hover': {
                        backgroundColor: global.page.next.isOpen ? 'initial' : 'rgba(250, 250, 250, 0.7)',
                    }
                }}
                onClick={() => {
                    if (global.page.next.isOpen) {
                        return;
                    }
                    handkeCreateRow?.();
                }}
            >
                <FontAwesomeIcon icon={faPlus} color={'#e0e0e0'} size='sm' style={{ marginRight: 5 }} />
                New {getPageName(currentPage as Page)}
            </Box>
        </Stack>
    );
    const history = rowsData?.map((row, i) => <Row key={i} row={row} rowType={RowType.History} />);

    return (
        <Stack display={'flex'} flexDirection={'column'} gap={2}>
            <RenderWhen if={currentPage === Page.Courses}>
                <H3 sx={{ fontWeight: '600' }}>{headerTitle}</H3>
            </RenderWhen>
            <Stack
                display={'flex'}
                flexWrap={isHistoryType ? 'wrap' : 'initial'}
                width={'100%'}
                flexDirection={isHistoryType ? 'row' : 'column'}
                gap={isHistoryType ? 2 : 1}
            >
                <RenderWhen if={isHistoryType} elseRender={rowList}>
                    {history}
                </RenderWhen>
            </Stack>
        </Stack>
    );
};

export default Rows;