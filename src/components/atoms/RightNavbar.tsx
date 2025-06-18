import { useDispatch, useSelector } from 'react-redux';
import Box from './Box';
import { directorySelector, globalSelector, State, userSelector } from '../../store/selector';
import { GlobalState, setPreviousPage } from '../../store/global';
import { UserState } from '../../store/user';
import { useQuery } from '@tanstack/react-query';
import { getCapitalizeCase, getController } from '../../utils/utils';
import { getRows } from '../../protocol/api';
import { Stack } from '@mui/material';
import { H4, Text } from './Typography';
import { Page } from '../../interface.global';
import { CurrentItemId, DirectoryState, setCurrentItem } from '../../store/directory';
import { Row } from '../../Page/Course/interface.directory';
import RenderWhen from './RenderWhen';
import { useNavigate } from 'react-router-dom';
import { usePage } from '../../hooks/usePage';

const RightNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleGoToNext, handleGoToPrevious } = usePage();

    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);
    const directory = useSelector<State, DirectoryState>(directorySelector);

    const previousPage = global.page.previous.title as string;
    const previousItemId = directory.currentItemId[previousPage as keyof CurrentItemId];
    const filterId = getPreviousIdFetching(
        global.page.current.title,
        directory.currentItemId,
        user._id,
    );

    // get title (last page)
    // get row data of last page

    const controller = getController(previousPage) as string;

    // REQUESTS
    const rows = useQuery({
        queryKey: ['getRows', filterId],
        queryFn: () => getRows(controller, filterId),
        enabled: !!controller,
    });

    console.log('#@rows', rows.data);
    console.log('#@currentItemId', previousItemId, directory.currentItemId);
    console.log('@@ controller', controller);
    console.log('@@ filterid', filterId);
    console.log('@@ previousPage', previousPage);
    console.log('@@ previousPage id', directory.currentItemId[previousPage as keyof CurrentItemId]);

    return (
        <Box sx={{ flex: 1, padding: 0, minWidth: '288px' }}>
            <Stack
                p={2}
                sx={{
                    backgroundColor: (th) => th.palette.grey['200'],
                    width: '-webkit-fill-available',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                }}
            >
                <H4 sx={{ fontWeight: '600' }}>{getCapitalizeCase(previousPage)}</H4>
            </Stack>
            <Stack display={'flex'} flexDirection={'column'} p={2} gap={2}>
                <RenderWhen if={!!rows.data?.rows}>
                    {rows.data?.rows?.map((row: Row, i: number) => {
                        return (
                            <Box
                                key={i}
                                onClick={() => {
                                    dispatch(
                                        setPreviousPage({
                                            _id: row._id,
                                            title: global.page.previous.title,
                                        }),
                                    );
                                    dispatch(
                                        setCurrentItem({
                                            [global.page.previous.title as keyof CurrentItemId]:
                                                row._id,
                                        }),
                                    );
                                    navigate(`/${global.page.current.title}/${row._id}`);
                                }}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flex: 1,
                                    gap: 1,
                                    backgroundColor:
                                        row._id === previousItemId
                                            ? (th) => th.palette.purple.main
                                            : 'initial',
                                    cursor: 'pointer',
                                    ':hover': {
                                        backgroundColor:
                                            row._id === previousItemId
                                                ? (th) => th.palette.purple.main
                                                : 'rgba(250, 250, 250, 0.7)',
                                    },
                                }}
                            >
                                <Text>{++i}.</Text>
                                <Text>{row.name}</Text>
                            </Box>
                        );
                    })}
                </RenderWhen>
            </Stack>
        </Box>
    );
};

export default RightNavbar;

function getPreviousIdFetching(
    currentPage: Page,
    listCurrentId: CurrentItemId,
    userId: string,
): string {
    switch (currentPage) {
        case Page.Chapters:
            return userId;

        case Page.Sections:
            return listCurrentId[Page.Courses];

        case Page.Section:
            return listCurrentId[Page.Chapters];

        default:
            return '';
    }
}
