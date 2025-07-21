import { Stack } from '@mui/material';
import { H3 } from './Typography';
import { Row as RowInterface } from '../../Page/Course/interface.directory';
import Row, { RowType } from './Row';
import RenderWhen from './RenderWhen';
import { useSelector } from 'react-redux';
import { globalSelector, State } from '../../store/selector';
import { GlobalState } from '../../store/global';
import { Page } from '../../interface.global';

interface RowProps {
    headerTitle: string;
    rowsData: RowInterface[];
}

const Rows = ({ headerTitle, rowsData }: RowProps) => {
    const global = useSelector<State, GlobalState>(globalSelector);

    const isHistoryType = headerTitle === 'History';
    const rowList = rowsData?.map((row, i) => <Row key={i} row={row} rowType={RowType.List} />);
    const history = rowsData?.map((row, i) => <Row key={i} row={row} rowType={RowType.History} />);

    return (
        <Stack display={'flex'} flexDirection={'column'} gap={2}>
            <RenderWhen if={global.page.current.title === Page.Courses}>
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
