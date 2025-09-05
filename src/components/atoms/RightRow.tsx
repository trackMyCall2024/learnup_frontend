import Box from './Box';
import { useDispatch, useSelector } from 'react-redux';
import { directorySelector, State } from '../../store/selector';
import { Text } from './Typography';
import { CurrentItemId, DirectoryState, setCurrentItem } from '../../store/directory';
import { Row } from '../../Page/Course/interface.directory';
import { useNavigate } from 'react-router-dom';
import { EllipsisText } from './Typography';
import { usePage } from '../../hooks/usePage';

interface RightListProps {
    row: Row;
    index: number;
}

const RightRow = ({ row, index }: RightListProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const directory = useSelector<State, DirectoryState>(directorySelector);

    const { currentPage, getPreviousPage } = usePage();

    const previousPage = getPreviousPage() as string;
    const previousItemId = directory.currentItemId[previousPage as keyof CurrentItemId];

    return (
        <Box
            onClick={() => {
                dispatch(
                    setCurrentItem({
                        [previousPage as keyof CurrentItemId]: row._id,
                    }),
                );
                navigate(`/${currentPage}/${row._id}`);
            }}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                gap: 1,
                backgroundColor:
                    row._id === previousItemId ? (th) => th.palette.grey['900'] : 'initial',
                cursor: 'pointer',
                ':hover': {
                    backgroundColor:
                        row._id === previousItemId
                            ? (th) => th.palette.background.default
                            : 'rgba(250, 250, 250, 0.7)',
                },
            }}
        >
            <Text
                sx={{
                    color:
                        row._id === previousItemId
                            ? (th) => th.palette.background.paper
                            : 'initial',
                }}
            >
                {++index}.
            </Text>
            <EllipsisText
                sx={{
                    color:
                        row._id === previousItemId
                            ? (th) => th.palette.background.paper
                            : 'initial',
                }}
                title={row.name}
            >
                {row.name}
            </EllipsisText>
        </Box>
    );
};

export default RightRow;
