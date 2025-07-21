import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getSection } from '../../protocol/api';
import { Stack } from '@mui/material';
import { ChatMessage, SectionProps, SectionTexts, SelectedGame, View } from './interface.type';
import RightNavbar from '../../components/atoms/RightNavbar';
import { useEffect, useState } from 'react';
import RenderWhen from '../../components/atoms/RenderWhen';
import Box from '../../components/atoms/Box';
import { ToolsState } from '../../components/atoms/Tools';
import Page from './Page';
import Chat from './Chat';

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

    // TOOLS STATES
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [chatIsOpen, setChatIsOpen] = useState<boolean>(false);
    const [startedParty, setStartedParty] = useState<boolean>(false);
    const [view, setView] = useState<View>(View.Pages);
    const [selectedGame, setSelectedGame] = useState<SelectedGame>(SelectedGame.Quiz);

    // GLOBAL LOCAL STATES
    const [canDisplayRightNavbar, setCanDisplayRightNavbar] = useState<boolean>(true);
    const [isLargeChat, setIsLargeChat] = useState<boolean>(false);

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

    const ariaValue =
        view === View.Pages
            ? text.currentPage.data
            : view === View.Resume
              ? text.resume
              : text.note;

    const handleAriaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        switch (view) {
            case View.Pages: {
                const newCurrentPage = { ...text.currentPage, data: newValue };
                setText((prev) => ({ ...prev, currentPage: newCurrentPage }));
                break;
            }

            case View.Resume: {
                const newResume = newValue;
                setText((prev) => ({ ...prev, resume: newResume }));
                break;
            }

            case View.Note: {
                const newNote = newValue;
                setText((prev) => ({ ...prev, note: newNote }));
                break;
            }

            default:
                break;
        }
    };

    const sendMessage = (chat: ChatMessage) => {
        const newChat = [...text.chat, chat];
        setText((prev) => ({ ...prev, chat: newChat }));
    };

    useEffect(() => {
        if (haveSection) {
            const currentPage: SectionTexts['currentPage'] = {
                title: sectionData.content.pages[pageIndex].title,
                subtitle: sectionData.content.pages[pageIndex].subtitle,
                data: sectionData.content.pages[pageIndex].data,
            };

            setText({
                currentPage,
                chat: sectionData.chat,
                resume: sectionData.content.resume,
                note: sectionData.content.note,
            });
        }
    }, [haveSection, pageIndex]);

    const tools: ToolsState = {
        view: {
            value: view,
            set: setView,
        },
        pageIndex: {
            value: pageIndex,
            set: setPageIndex,
        },
        openChat: {
            value: chatIsOpen,
            set: setChatIsOpen,
        },
        startedParty: {
            value: startedParty,
            set: setStartedParty,
        },
        game: {
            value: selectedGame,
            set: setSelectedGame,
        },
    };

    console.log('@@text', text.chat);
    console.log('@@section', sectionData?.chat);

    return (
        <Stack display={'flex'} flex={1} flexDirection={'row'} gap={5}>
            <Stack display={'flex'} flexDirection={'column'} width={'-webkit-fill-available'}>
                {/* <Search inputValue={filterSearch} setInputValue={setFilterSearch} /> */}
                <RenderWhen if={haveSection}>
                    <Stack display={'flex'} flexDirection={'column'} gap={2} flex={1}>
                        {/* <H3 sx={{ fontWeight: '600' }}>{sectionData?.name}</H3> */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                                padding: 0,
                            }}
                        >
                            <RenderWhen if={haveSection && !chatIsOpen}>
                                <Page
                                    sectionName={sectionData?.name as string}
                                    tools={tools}
                                    canDisplayRightNavbar={canDisplayRightNavbar}
                                    ariaValue={ariaValue}
                                    setCanDisplayRightNavbar={setCanDisplayRightNavbar}
                                    handleAriaChange={handleAriaChange}
                                />
                            </RenderWhen>
                            <RenderWhen if={haveSection && chatIsOpen && !!section.data?.chat}>
                                <Chat
                                    chat={text.chat}
                                    sendMessage={sendMessage}
                                    isLargeChat={isLargeChat}
                                    setIsLargeChat={setIsLargeChat}
                                />
                            </RenderWhen>
                        </Box>
                    </Stack>
                </RenderWhen>
            </Stack>
            <RenderWhen if={canDisplayRightNavbar && !isLargeChat}>
                <RightNavbar section={section.data} tools={tools} />
            </RenderWhen>
        </Stack>
    );
};

export default Section;
