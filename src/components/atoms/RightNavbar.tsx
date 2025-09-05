
import Box from './Box';
import { useQuery } from '@tanstack/react-query';
import { getCapitalizeCase, getDirectoryType } from '../../utils/utils';
import { getParents } from '../../protocol/api';
import { Stack } from '@mui/material';
import { H4 } from './Typography';
import { Page } from '../../interface.global';
import { Row } from '../../Page/Course/interface.directory';
import RenderWhen from './RenderWhen';
import { SectionProps } from '../../Page/Section/interface.type';
import RightRow from './RightRow';
import Tools, { ToolsState } from './Tools';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { usePage } from '../../hooks/usePage';

interface RightNavBarProps {
    section?: SectionProps;
    tools?: ToolsState;
}

const RightNavbar = ({ section, tools: toolsState }: RightNavBarProps) => {
    const { getPreviousPage, currentPage, currentId } = usePage();
    const isSectionPage = currentPage === Page.Section;

    const previousPage = getPreviousPage()?.toString() as string;

    console.log('@@Front - currentId:', currentId, getDirectoryType(previousPage));

    // REQUESTS
    const rows = useQuery({
        queryKey: ['getParents', currentId],
        queryFn: () => getParents(currentId),
        enabled: !!currentId && !isSectionPage,
    });

    console.log('@@Front - rows:', rows.data);

    const previousPages = rows.data?.map((row: Row, i: number) => (
        <RightRow key={i} row={row} index={i} />
    ));
    const tools = <Tools section={section} tools={toolsState as ToolsState} />;

    return (
        <Box sx={{ flex: 1, padding: 0, minWidth: '288px' }}>
            <Stack
                p={2}
                sx={{
                    backgroundColor: '#F8F8F7',
                    borderBottom: '1px solid #E0E0E0',
                    width: '-webkit-fill-available',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                }}
            >
                <H4
                    sx={{
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#35332F',
                    }}
                >
                    <FontAwesomeIcon icon={faBook} />
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