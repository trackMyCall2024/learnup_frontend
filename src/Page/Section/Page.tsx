import { Stack } from '@mui/material';
import { H4, Text } from '../../components/atoms/Typography';
import { View } from './interface.type';
import FileAction from '../../components/atoms/FileActions';
import { Textarea } from '@mui/joy';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import CustomBtn from '../../components/atoms/CustomBtn';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { ToolsState } from '../../components/atoms/Tools';
import { getCapitalizeCase } from '../../utils/utils';
import { useEffect, useRef } from 'react';

interface PageProps {
    sectionName: string;
    tools: ToolsState;
    pageIsZoomed: boolean;
    ariaValue: string;
    setPageIsZoomed: React.Dispatch<React.SetStateAction<boolean>>;
    handleAriaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Page = ({
    sectionName,
    tools,
    pageIsZoomed,
    ariaValue,
    setPageIsZoomed,
    handleAriaChange,
}: PageProps) => {
    return (
        <Stack
            display={'flex'}
            flexDirection={'column'}
            flex={1}
            minHeight={'0px'}
            sx={{ overflow: 'hidden' }}
        >
            <Stack
                sx={{
                    borderBottom: (th) => `0.5px solid ${th.palette.grey['400']}`,
                }}
                padding={2}
            >
                <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Stack gap={0.5}>
                        <H4 sx={{ fontWeight: '600' }}>
                            {getCapitalizeCase(tools.view.value)}{' '}
                            {tools.view.value === View.Pages
                                ? `${tools.pageIndex.value + 1}`
                                : ''}{' '}
                        </H4>
                        <Text sx={{ color: (th) => th.palette.grey['600'] }}>{sectionName}</Text>
                    </Stack>
                    <Stack
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        gap={2}
                    >
                        <FileAction size="sm" />
                        <CustomBtn onClick={() => setPageIsZoomed(!pageIsZoomed)}>
                            {pageIsZoomed ? (
                                <ZoomInMapIcon
                                    fontSize="small"
                                    sx={{
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                />
                            ) : (
                                <ZoomOutMapIcon
                                    fontSize="small"
                                    sx={{
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                />
                            )}
                        </CustomBtn>
                    </Stack>
                </Stack>
            </Stack>

            <Textarea
                onChange={handleAriaChange}
                value={ariaValue}
                sx={{
                    flex: 1,
                    padding: 2,
                    border: 0,
                    resize: 'none',
                    minHeight: '0',
                    maxHeight: 'none',
                    '& .MuiTextarea-root': {
                        height: 'auto !important',
                        overflow: 'hidden !important',
                        overflowY: 'scroll !important',
                    },
                    '& .MuiInputBase-root': {
                        height: 'auto !important',
                        overflow: 'hidden !important',
                        overflowY: 'scroll !important',
                    },
                    '& .MuiInputBase-input': {
                        height: 'auto !important',
                        overflow: 'hidden !important',
                        overflowY: 'scroll !important',
                    },
                    '& textarea': {
                        height: 'auto !important',
                        overflow: 'hidden !important',
                        overflowY: 'scroll !important',
                        // Scrollbar style
                        '&::-webkit-scrollbar': {
                            width: '6px', // Augmenter la largeur de la scrollbar
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(0,0,0,0.3)', // Thumb plus visible
                            borderRadius: '6px',
                            border: '2px solid transparent',
                            backgroundClip: 'content-box',
                            '&:hover': {
                                background: 'rgba(0,0,0,0.5)', // Plus foncé au hover
                                backgroundClip: 'content-box',
                            },
                        },
                    },
                    '& .Mui-focused': {
                        border: 0,
                    },
                }}
            />
        </Stack>
    );
};

export default Page;
