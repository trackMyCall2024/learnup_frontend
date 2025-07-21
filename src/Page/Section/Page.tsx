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

interface PageProps {
    sectionName: string;
    tools: ToolsState;
    canDisplayRightNavbar: boolean;
    ariaValue: string;
    setCanDisplayRightNavbar: React.Dispatch<React.SetStateAction<boolean>>;
    handleAriaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Page = ({
    sectionName,
    tools,
    canDisplayRightNavbar,
    ariaValue,
    setCanDisplayRightNavbar,
    handleAriaChange,
}: PageProps) => {
    return (
        <>
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
                        <Text sx={{ color: (th) => th.palette.primary[600] }}>{sectionName}</Text>
                    </Stack>
                    <Stack
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        gap={2}
                    >
                        <FileAction size="sm" />
                        <CustomBtn onClick={() => setCanDisplayRightNavbar(!canDisplayRightNavbar)}>
                            {canDisplayRightNavbar ? (
                                <ZoomOutMapIcon
                                    fontSize="small"
                                    sx={{
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                />
                            ) : (
                                <ZoomInMapIcon
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
                    // overflowY: 'auto',
                    maxHeight: '-webkit-fill-available',
                    '& .Mui-focused': {
                        border: 0,
                    },
                }}
            />
        </>
    );
};

export default Page;
