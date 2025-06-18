import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getSection } from '../../protocol/api';
import { Button, Stack } from '@mui/material';
import { H3, H4, Text } from '../../components/atoms/Typography';
import { SectionProps, SectionTexts } from './interface.type';
import RightNavbar from '../../components/atoms/RightNavbar';
import { useEffect, useState } from 'react';
import RenderWhen from '../../components/atoms/RenderWhen';
import Box from '../../components/atoms/Box';
import FileAction from '../../components/atoms/FileActions';
import { Textarea } from '@mui/joy';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const Section = () => {
    // QUERY
    const { id: sectionId } = useParams();

    // REQUESTS
    const section = useQuery({
        queryKey: ['getSection'],
        queryFn: () => getSection(sectionId as string),
        enabled: !!sectionId,
    });

    const sectionData = section.data as SectionProps | undefined;
    const haveSection = !!sectionData?._id;

    const [filterSearch, setFilterSearch] = useState<string>('');
    const [text, setText] = useState<SectionTexts>({
        currentPage: {
            title: '',
            subtitle: '',
            data: '',
        },
        chat: [],
        resume: '',
        note: '',
    });

    useEffect(() => {
        if (haveSection) {
            const currentPage: SectionTexts['currentPage'] = {
                title: sectionData.content.pages[0].title,
                subtitle: sectionData.content.pages[0].subtitle,
                data: sectionData.content.pages[0].data,
            };

            setText({
                currentPage,
                chat: sectionData.chat,
                resume: sectionData.content.resume,
                note: sectionData.content.note,
            });
        }
    }, [haveSection]);

    return (
        <Stack display={'flex'} flex={1} flexDirection={'row'} gap={5}>
            <Stack display={'flex'} flexDirection={'column'} width={'-webkit-fill-available'}>
                {/* <Search inputValue={filterSearch} setInputValue={setFilterSearch} /> */}
                <RenderWhen if={haveSection}>
                    <Stack display={'flex'} flexDirection={'column'} gap={2} flex={1}>
                        <H3 sx={{ fontWeight: '600' }}>{sectionData?.name}</H3>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                                padding: 0,
                            }}
                        >
                            <Stack
                                sx={{
                                    borderBottom: (th) => `0.5px solid ${th.palette.grey['400']}`,
                                }}
                                padding={2}
                            >
                                <Stack
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                >
                                    <Stack gap={0.5}>
                                        <H4 sx={{ fontWeight: '500' }}>{text.currentPage.title}</H4>
                                        <Text sx={{ color: (th) => th.palette.primary[600] }}>
                                            {text.currentPage.subtitle}
                                        </Text>
                                    </Stack>
                                    <Stack
                                        flexDirection={'column'}
                                        justifyContent={'space-between'}
                                        alignItems={'flex-end'}
                                    >
                                        <ZoomOutMapIcon fontSize="small" sx={{ color: (th) => th.palette.primary['600'], cursor: 'pointer'}} />
                                        <FileAction size="sm" />
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Textarea
                                onChange={(e) =>
                                    setText({
                                        ...text,
                                        currentPage: {
                                            ...text.currentPage,
                                            data: e.target.value,
                                        },
                                    })
                                }
                                value={text.currentPage.data}
                                sx={{
                                    flex: 1,
                                    padding: 2,
                                    border: 0,
                                    // overflowY: 'auto',
                                    maxHeight: '-webkit-fill-available',
                                    '& .Mui-focused': {
                                        border: 0,
                                    },
                                }}
                            />
                        </Box>
                    </Stack>
                </RenderWhen>
            </Stack>
            <RightNavbar />
        </Stack>
    );
};

export default Section;
