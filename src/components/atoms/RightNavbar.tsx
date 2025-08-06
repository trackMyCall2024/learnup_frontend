import { useSelector } from 'react-redux';
import Box from './Box';
import { directorySelector, globalSelector, State, userSelector } from '../../store/selector';
import { GlobalState } from '../../store/global';
import { UserState } from '../../store/user';
import { useQuery } from '@tanstack/react-query';
import { getCapitalizeCase, getController, getDirectoryType } from '../../utils/utils';
import { getRows } from '../../protocol/api';
import { Stack } from '@mui/material';
import { H4 } from './Typography';
import { Page } from '../../interface.global';
import { CurrentItemId, DirectoryState } from '../../store/directory';
import { Row } from '../../Page/Course/interface.directory';
import RenderWhen from './RenderWhen';
import { SectionProps } from '../../Page/Section/interface.type';
import RightList from './RightList';
import Tools, { ToolsState } from './Tools';
import { useState } from 'react';

interface RightNavBarProps {
    section?: SectionProps;
    tools?: ToolsState;
}

const RightNavbar = ({ section, tools: toolsState }: RightNavBarProps) => {
    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);
    const directory = useSelector<State, DirectoryState>(directorySelector);

    const isSectionPage = global.page.current.title === Page.Section;

    const previousPage = global.page.previous.title as string;
    const filterId = getPreviousIdFetching(
        global.page.current.title,
        directory.currentItemId,
        user._id,
    );

    const controller = getController(previousPage) as string;
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    // REQUESTS
    const rows = useQuery({
        queryKey: ['getRows', filterId, pagination],
        queryFn: () => getRows(getDirectoryType(previousPage), filterId, '', pagination.page, pagination.limit),
        enabled: !!controller && !isSectionPage,    
    });

    const previousPages = rows.data?.map((row: Row, i: number) => (
        <RightList key={i} row={row} index={i} />
    ));
    const tools = <Tools section={section} tools={toolsState as ToolsState}/>;

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
                <H4 sx={{ fontWeight: '600' }}>
                    {section?.name ? 'Tools' : getCapitalizeCase(previousPage)}
                </H4>
            </Stack>
            <Stack display={'flex'} flexDirection={'column'} p={2} gap={2}>
                <RenderWhen if={isSectionPage} elseRender={previousPages}>
                    {tools}
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
