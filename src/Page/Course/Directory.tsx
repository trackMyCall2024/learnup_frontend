import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { globalSelector, State, userSelector } from '../../store/selector';
import { GlobalState } from '../../store/global';
import { useQuery } from '@tanstack/react-query';
import { Stack } from '@mui/material';
import Search from '../../components/atoms/Search';
import { getHistory, getRows } from '../../protocol/api';
import { Page } from '../../interface.global';
import RenderWhen from '../../components/atoms/RenderWhen';
import { useNavigate, useParams } from 'react-router-dom';
import Rows from '../../components/atoms/Rows';
import { Row } from './interface.directory';
import { UserState } from '../../store/user';
import RightNavbar from '../../components/atoms/RightNavbar';
import { getController } from '../../utils/utils';
import { usePage } from '../../hooks/usePage';

interface DirectoryProps {
    halfPageIsOpen?: boolean;
    idFromHalfPage?: string;
    headerFromHalfPage?: JSX.Element;
}

const Directory = ({ halfPageIsOpen, idFromHalfPage, headerFromHalfPage }: DirectoryProps) => {
    // QUERY
    const { id: idFromUrl } = useParams();
    const filterId = idFromHalfPage ?? (idFromUrl as string);

    // STORE
    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);
    const currentPage = halfPageIsOpen
        ? (global.page.next.title as string)
        : global.page.current.title;

    const controller = getController(currentPage) as string;

    // HOOKS
    const [filterSearch, setFilterSearch] = useState<string>('');
    const { handleBackToCourses } = usePage();

    // REQUESTS
    const rows = useQuery({
        queryKey: ['getRows', filterId, filterSearch],
        queryFn: () => getRows(controller, filterId, filterSearch),
        enabled: !!global.page,
    });

    const history = useQuery({
        queryKey: ['getHistory', currentPage],
        queryFn: () => getHistory(currentPage as string, user._id),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    // state display { history, rightNavbar: enum }
    // Render when display rightNavbar (if not courses) -> composant rightNavbar (props: page)

    const haveRows = !rows.isLoading && rows.data;
    const haveHistory = !!history.data?.length;
    const canOpenRightNavbar = !halfPageIsOpen && currentPage !== Page.Courses;

    useEffect(() => {
        setFilterSearch('');
        
        if (canOpenRightNavbar && !global.page.previous.title) {
            handleBackToCourses();
        }
    }, [canOpenRightNavbar, global.page.previous.title]);

    return (
        <Stack
            display={'flex'}
            flex={1}
            flexDirection={'row'}
            gap={canOpenRightNavbar ? 5 : 0}
        >
            <Stack display={'flex'} flexDirection={'column'} width={halfPageIsOpen ? '-webkit-fill-available' : '70%'}>
                <RenderWhen if={halfPageIsOpen}>{headerFromHalfPage}</RenderWhen>
                <Stack p={idFromHalfPage ? '30px' : 0} gap={5}>
                    <Search inputValue={filterSearch} setInputValue={setFilterSearch} />
                    <RenderWhen if={haveHistory}>
                        <Rows headerTitle={'History'} rowsData={history.data as Row[]} />
                    </RenderWhen>
                    <RenderWhen if={haveRows}>
                        <Rows
                            headerTitle={`All ${
                                headerFromHalfPage
                                    ? (global.page.next.title as Page)
                                    : global.page.current.title
                            }`}
                            rowsData={rows.data?.rows as Row[]}
                        />
                    </RenderWhen>
                </Stack>
            </Stack>
            <RenderWhen if={canOpenRightNavbar}>
                <RightNavbar />
            </RenderWhen>
        </Stack>
    );
};

export default Directory;
