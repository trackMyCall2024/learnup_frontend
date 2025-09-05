import { Button, Stack } from '@mui/material';
import { Text } from './Typography';
import CustomBtn from './CustomBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faComment,
    faFileLines,
    faListUl,
    faPenToSquare,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import ToolBox from './ToolBox';
import { SectionProps, SelectedGame, View } from '../../Page/Section/interface.type';
import { Option, Select } from '@mui/joy';
import { getCapitalizeCase } from '../../utils/utils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CloseIcon from '@mui/icons-material/Close';

export interface ToolsState {
    view: {
        value: View;
        set: React.Dispatch<React.SetStateAction<View>>;
    };
    page: {
        index: {
            id: string;
            value: number;
            set: React.Dispatch<React.SetStateAction<number>>;
        };
        add: () => void;
        remove: (pageId: string) => void;
    };
    openChat: {
        value: boolean;
        set: React.Dispatch<React.SetStateAction<boolean>>;
    };
    startedParty: {
        value: boolean;
        set: React.Dispatch<React.SetStateAction<boolean>>;
    };
    game: {
        value: SelectedGame;
        set: React.Dispatch<React.SetStateAction<SelectedGame>>;
    };
}

interface ToolsProps {
    section?: SectionProps;
    tools: ToolsState;
}

const Tools = ({ section, tools }: ToolsProps) => {
    const gameOptions = [SelectedGame.Quiz, SelectedGame.FlashCard];

    const btnStyle = {
        p: 1,
        borderRadius: 2,
        textTransform: 'none',
        fontSize: '14px',
    };

    const views = [
        { icon: faFileLines, value: View.Pages },
        { icon: faListUl, value: View.Resume },
        { icon: faPenToSquare, value: View.Note },
    ];

    return (
        <Stack
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            height={'-webkit-fill-available'}
            px={0.5}
            gap={2}
            flex={1}
        >
            <ToolBox
                title={'Views'}
                disabled={tools.openChat.value}
                icon={<VisibilityIcon fontSize="small" />}
            >
                <Stack
                    display={'flex'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    gap={2}
                >
                    {views.map((view, index) => (
                        <CustomBtn
                            key={index}
                            sx={{
                                borderRadius: '10px',
                                minWidth: '30px',
                                backgroundColor: (th) =>
                                    tools.view.value === view.value
                                        ? th.palette.background.default
                                        : 'initial',
                            }}
                            onClick={() => tools.view.set(view.value)}
                        >
                            <FontAwesomeIcon
                                icon={view.icon}
                                style={{
                                    color: tools.view.value === view.value ? '#EFEFEF' : 'initial',
                                }}
                            />
                        </CustomBtn>
                    ))}
                </Stack>
            </ToolBox>

            <ToolBox
                title={'Pages'}
                disabled={tools.openChat.value}
                icon={<AutoStoriesIcon fontSize="small" />}
            >
                <Stack
                    display={'flex'}
                    flexDirection={'row'}
                    flexWrap={'wrap'}
                    alignItems={'flex-end'}
                    gap={2}
                >
                    {section?.pages?.map((_, i) => (
                        <CustomBtn
                            key={i}
                            sx={{
                                // minWidth: '40px',
                                // minHeight: '46px',
                                backgroundColor: (th) =>
                                    tools.page.index.value === i
                                        ? th.palette.background.default
                                        : 'initial',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                            }}
                            onClick={() => tools.page.index.set && tools.page.index.set(i)}
                        >
                            <FontAwesomeIcon
                                icon={faFileLines}
                                style={{
                                    color: tools.page.index.value === i ? '#EFEFEF' : 'initial',
                                }}
                            />
                            <Text
                                sx={{
                                    color: (th) =>
                                        tools.page.index.value === i
                                            ? th.palette.grey['200']
                                            : 'initial',
                                    fontWeight: '600',
                                }}
                            >
                                {i + 1}
                            </Text>
                        </CustomBtn>
                    ))}
                    <CustomBtn
                        sx={{
                            backgroundColor: 'initial',
                            p: '10px',
                        }}
                        onClick={() => {
                            tools.page.add();
                            tools.page.index.set(tools.page.index.value + 1);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </CustomBtn>
                </Stack>
            </ToolBox>

            <ToolBox
                title={'Game'}
                disabled={tools.openChat.value}
                icon={<SportsEsportsIcon fontSize="small" />}
            >
                <Select
                    value={tools.game.value}
                    onChange={(_, value) => tools.game.set(value ?? SelectedGame.Quiz)}
                    placeholder="Choose a game"
                >
                    {gameOptions.map((option, index) => (
                        <Option key={index} value={option}>
                            {getCapitalizeCase(option)}
                        </Option>
                    ))}
                </Select>
                <Button
                    size="small"
                    color="info"
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    sx={btnStyle}
                >
                    Play
                </Button>
            </ToolBox>

            <ToolBox title={'IA teacher'} icon={<SchoolIcon fontSize="small" />}>
                <Button
                    size="small"
                    color="info"
                    variant="contained"
                    sx={btnStyle}
                    startIcon={
                        tools.openChat.value ? <CloseIcon /> : <FontAwesomeIcon icon={faComment} />
                    }
                    disabled={tools.startedParty.value}
                    onClick={() => {
                        tools.openChat.set(!tools.openChat.value);
                        // tools.startedParty.set(!tools.startedParty.value);
                    }}
                >
                    {`${tools.openChat.value ? 'Close' : 'Open'} Chat`}
                </Button>
                <Button
                    size="small"
                    color="info"
                    variant="contained"
                    sx={btnStyle}
                    startIcon={
                        tools.startedParty.value ? (
                            <CloseIcon />
                        ) : (
                            <img
                                draggable={false}
                                src="/icons/white-analyze.svg"
                                height={10}
                                width={'auto'}
                            />
                        )
                    }
                    disabled={tools.openChat.value}
                    onClick={() => {
                        tools.startedParty.set(!tools.startedParty.value);
                        // tools.openChat.set(!tools.openChat.value);
                    }}
                >
                    {`${tools.startedParty.value ? 'Stop' : 'Start'} voice chat`}
                </Button>
            </ToolBox>
        </Stack>
    );
};

export default Tools;
