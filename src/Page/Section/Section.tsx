import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getChat, getDirectory, getNote, getPages, getResume } from '../../protocol/api';
import { Stack } from '@mui/material';
import {
    ChatMessage,
    Page as PageInterface,
    SectionProps,
    SelectedGame,
    View,
} from './interface.type';
import RightNavbar from '../../components/atoms/RightNavbar';
import { useEffect, useState } from 'react';
import RenderWhen from '../../components/atoms/RenderWhen';
import Box from '../../components/atoms/Box';
import { ToolsState } from '../../components/atoms/Tools';
import Page from './Page';
import Chat from './Chat';
import {
    ChatResponse,
    ChunkResponse,
    DirectoryResponse,
    NoteResponse,
    PageResponse,
    ResumeResponse,
} from '../../protocol/api.type';
import { log } from 'console';
import { State } from '../../store/selector';
import { GlobalState, setIsLessonZoomed } from '../../store/global';
import { globalSelector } from '../../store/selector';
import { useDispatch, useSelector } from 'react-redux';

const Section = () => {
    // QUERY
    const { id } = useParams();
    const sectionId = id as string;

    // REQUESTS
    const { data: directoryRequest } = useQuery({
        queryKey: ['getDirectory', sectionId],
        queryFn: () => getDirectory(sectionId),
        enabled: !!sectionId,
    });

    const resumeRequest = useQuery({
        queryKey: ['getResume', sectionId],
        queryFn: () => getResume(sectionId),
        enabled: !!sectionId,
    });

    const noteRequest = useQuery({
        queryKey: ['getNote', sectionId],
        queryFn: () => getNote(sectionId),
        enabled: !!sectionId,
    });

    const chatRequest = useQuery({
        queryKey: ['getChat', sectionId],
        queryFn: () => getChat(sectionId),
        enabled: !!sectionId,
    });

    const pagesRequest = useQuery({
        queryKey: ['getPages', sectionId],
        queryFn: () => getPages(sectionId as string),
        enabled: !!sectionId,
    });

    const [directory, setDirectory] = useState<DirectoryResponse | null>(null);
    const [resume, setResume] = useState<ResumeResponse | null>(null);
    const [note, setNote] = useState<NoteResponse | null>(null);
    const [chat, setChat] = useState<ChatResponse[]>([]);
    const [pages, setPages] = useState<PageInterface[]>([]);

    // TOOLS STATES
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [chatIsOpen, setChatIsOpen] = useState<boolean>(false);
    const [startedParty, setStartedParty] = useState<boolean>(false);
    const [view, setView] = useState<View>(View.Pages);
    const [selectedGame, setSelectedGame] = useState<SelectedGame>(SelectedGame.Quiz);

    const global = useSelector<State, GlobalState>(globalSelector);
    const dispatch = useDispatch();
    const isLoading = resumeRequest.isLoading || noteRequest.isLoading || chatRequest.isLoading;

    // GLOBAL LOCAL STATES
    const [isLargeChat, setIsLargeChat] = useState<boolean>(false);

    const handleAriaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        switch (view) {
            case View.Pages: {
                const newCurrentPage = { ...pages[pageIndex], data: newValue };
                setPages((prev) => {
                    const newPages = [...prev];
                    newPages[pageIndex] = newCurrentPage;
                    return newPages;
                });
                break;
            }

            case View.Resume: {
                if (resume) {
                    const newResume = { ...resume, data: newValue };
                    setResume(newResume);
                }
                break;
            }

            case View.Note: {
                if (note) {
                    const newNote = { ...note, data: newValue };
                    setNote(newNote);
                }
                break;
            }

            default:
                break;
        }
    };

    const sendMessage = (newMessage: ChatMessage) => {
        const newChat = [...chat, { ...newMessage, section: sectionId as string } as ChatResponse];
        setChat(newChat);
    };

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
        addPage: () => {
            setPages((prev) => [
                ...prev,
                {
                    _id: '',
                    title: 'New Page',
                    data: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);
            // setPageIndex(pages.length - 1);
        },
    };

    // display chunks ou note ou resume
    const ariaValue = getAriaValue(view, pageIndex, pages, resume, note);

    const sectionData: SectionProps = {
        _id: directory?._id as string,
        parentId: directory?.parentID as string,
        name: directory?.name as string,
        chat,
        pages,
        resume: resume as ResumeResponse,
        note: note as NoteResponse,
    };

    const haveSection =
        !!directoryRequest?._id &&
        !!pagesRequest?.data &&
        !!resumeRequest?.data &&
        !!noteRequest?.data &&
        !!chatRequest?.data;

    console.log('@@Front - pagesRequest.data:', pagesRequest.data);
    console.log('@@Front - resumeRequest.data:', resumeRequest.data);
    console.log('@@Front - noteRequest.data:', noteRequest.data);
    console.log('@@Front - chatRequest.data:', chatRequest.data);
    console.log('@@Front - directoryRequest.data:', directoryRequest);

    console.log('@@Front - haveSection:', haveSection);

    useEffect(() => {
        if (haveSection) {
            console.log('@@Front - pagesRequest.data:', pagesRequest.data);
            console.log('@@Front - resumeRequest.data:', resumeRequest.data);
            console.log('@@Front - noteRequest.data:', noteRequest.data);

            setPages(pagesRequest.data as PageInterface[]);
            setChat(chatRequest.data as ChatResponse[]);
            setResume(resumeRequest.data as ResumeResponse);
            setNote(noteRequest.data as NoteResponse);
            setDirectory(directoryRequest as DirectoryResponse);

            console.log('@@Front - pages state after set:', pagesRequest.data);
        }
    }, [haveSection, pageIndex]);

    return (
        <Stack display={'flex'} flex={1} flexDirection={'row'} gap={5}>
            <Stack
                display={'flex'}
                flexDirection={'column'}
                width={'-webkit-fill-available'}
                minHeight={'0px'}
            >
                <RenderWhen if={haveSection}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            padding: 0,
                            minHeight: '0px',
                        }}
                    >
                        <RenderWhen if={haveSection && !chatIsOpen}>
                            <Page
                                sectionName={sectionData?.name as string}
                                tools={tools}
                                pageIsZoomed={global.lesson.isZoomed}
                                ariaValue={ariaValue}
                                setPageIsZoomed={() =>
                                    dispatch(setIsLessonZoomed(!global.lesson.isZoomed))
                                }
                                handleAriaChange={handleAriaChange}
                            />
                        </RenderWhen>
                        <RenderWhen if={haveSection && chatIsOpen && !!chat}>
                            <Chat
                                chat={chat as ChatMessage[]}
                                sendMessage={sendMessage}
                                isLargeChat={isLargeChat}
                                setIsLargeChat={setIsLargeChat}
                            />
                        </RenderWhen>
                    </Box>
                </RenderWhen>
            </Stack>
            <RenderWhen if={!global.lesson.isZoomed && !isLargeChat}>
                <RightNavbar section={sectionData} tools={tools} />
            </RenderWhen>
        </Stack>
    );
};

export default Section;

function getAriaValue(
    view: View,
    pageIndex: number,
    pages: PageInterface[],
    resume: ResumeResponse | null,
    note: NoteResponse | null,
): string {
    switch (view) {
        case View.Pages:
            return pages[pageIndex]?.data;
        case View.Resume:
            return resume?.data || '';
        case View.Note:
            return note?.data || '';
    }
}
