import { Stack } from '@mui/material';
import { H3 } from './Typography';
import { Row as RowInterface } from '../../Page/Course/interface.directory';
import Row, { RowType } from './Row';
import RenderWhen from './RenderWhen';

interface RowProps {
    headerTitle: string;
    rowsData: RowInterface[];
}

const Rows = ({ headerTitle, rowsData }: RowProps) => {
    const isHistoryType = headerTitle === 'History';
    const rowList = rowsData?.map((row, i) => <Row key={i} row={row} rowType={RowType.List} />);
    const history = rowsData?.map((row, i) => <Row key={i} row={row} rowType={RowType.History} />);

    return (
        <Stack display={'flex'} flexDirection={'column'} gap={2}>
            <H3 sx={{ fontWeight: '600' }}>{headerTitle}</H3>
            <Stack
                display={'flex'}
                flexWrap={isHistoryType ? 'wrap' : 'initial'}
                width={isHistoryType ? '50%' : '100%'}
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
