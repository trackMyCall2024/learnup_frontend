import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
    getChat,
    getDirectory,
    getNote,
    getPages,
    getResume,
    createDefaultPage,
    updateNote,
    updatePage,
    updateResume,
    deletePage,
} from '../../protocol/api';
import { debounce, Stack } from '@mui/material';
import {
    ChatMessage,
    Page as PageInterface,
    SectionProps,
    SelectedGame,
    View,
} from './interface.type';
import RightNavbar from '../../components/atoms/RightNavbar';
import { useCallback, useEffect, useRef, useState } from 'react';
import RenderWhen from '../../components/atoms/RenderWhen';
import Box from '../../components/atoms/Box';
import { ToolsState } from '../../components/atoms/Tools';
import Page from './Page';
import Chat from './Chat';
import {
    ChatResponse,
    DirectoryResponse,
    NoteResponse,
    ResumeResponse,
} from '../../protocol/api.type';
import { State } from '../../store/selector';
import { GlobalState, setIsLessonZoomed } from '../../store/global';
import { globalSelector } from '../../store/selector';
import { useDispatch, useSelector } from 'react-redux';
import { getTmpId } from '../../utils/utils';

const Section = () => {
    // QUERY
    const { id } = useParams();
    const sectionId = id as string;
    const tmpId = useRef<string>('');

    // REQUESTS
    const { data: directoryRequest } = useQuery({
        queryKey: ['getDirectory', sectionId],
        queryFn: () => getDirectory(sectionId),
        enabled: !!sectionId,
        retry: false,
    });

    const resumeRequest = useQuery({
        queryKey: ['getResume', sectionId],
        queryFn: () => getResume(sectionId),
        enabled: !!sectionId,
        retry: false,
    });

    const noteRequest = useQuery({
        queryKey: ['getNote', sectionId],
        queryFn: () => getNote(sectionId),
        enabled: !!sectionId,
        retry: false,
    });

    const chatRequest = useQuery({
        queryKey: ['getChat', sectionId],
        queryFn: () => getChat(sectionId),
        enabled: !!sectionId,
        retry: false,
    });

    const pagesRequest = useQuery({
        queryKey: ['getPages', sectionId],
        queryFn: () => getPages(sectionId as string),
        enabled: !!sectionId,
        retry: false,
    });

    const createDefaultPageMutation = useMutation({
        mutationFn: async (tmpId: string) => {
            return await createDefaultPage(sectionId, tmpId);
        },
        onSuccess: (data) => {
            const indexToBeUpdated = pages.findIndex((page) => page.tmp_id === data.tmp_id);
            if (indexToBeUpdated === -1) {
                return;
            }
            setPages((prev) => {
                const newPages = [...prev];
                const currentPage = newPages[indexToBeUpdated];
                currentPage._id = data.page._id;
                return newPages;
            });
        },
        onError: (error) => {
            // reomve item in pages with tmp_id
            setPages((prev) => {
                return prev.filter((page) => page.tmp_id !== tmpId.current);
            });
        },
    });

    const deletePageMutation = useMutation({
        mutationKey: ['deletePage', sectionId],
        mutationFn: async (pageId: string) => {
            return await deletePage(pageId);
        },
        onSuccess: () => {
            setPages((prev) => {
                return prev.filter((page) => page.tmp_id !== tmpId.current);
            });
        },
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

    const debouncedUpdate = useCallback(
        debounce((controller: 'pages' | 'resume' | 'note', newText: string) => {
            switch (controller) {
                case 'pages': {
                    if (!pages[pageIndex]._id) {
                        return;
                    }
                    console.log('@@Front - updatePage', pages[pageIndex]._id);
                    updatePage(pages[pageIndex]._id, {
                        _id: pages[pageIndex]._id,
                        section: sectionId,
                        data: newText,
                    });
                    break;
                }
                case 'resume': {
                    if (!resume?._id) {
                        return;
                    }
                    updateResume(resume._id, {
                        _id: resume._id,
                        section: sectionId,
                        data: newText,
                    });
                    break;
                }
                case 'note': {
                    if (!note?._id) {
                        return;
                    }
                    updateNote(note._id, { _id: note._id, section: sectionId, data: newText });
                    break;
                }
            }
        }, 500), // 500ms après la dernière frappe
        [pages, pageIndex, resume, note],
    );

    const handleAriaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        switch (view) {
            case View.Pages: {
                if (!pages[pageIndex]) {
                    return;
                }
                const newCurrentPage = { ...pages[pageIndex], data: newValue };
                setPages((prev) => {
                    const newPages = [...prev];
                    newPages[pageIndex] = newCurrentPage;
                    return newPages;
                });
                debouncedUpdate('pages', newValue);
                break;
            }

            case View.Resume: {
                if (!resume) {
                    return;
                }
                const newResume = { ...resume, data: newValue };
                setResume(newResume);
                debouncedUpdate('resume', newValue);
                break;
            }

            case View.Note: {
                if (!note) {
                    return;
                }
                const newNote = { ...note, data: newValue };
                setNote(newNote);
                debouncedUpdate('note', newValue);
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
        page: {
            index: {
                id: pages[pageIndex]?._id ?? '',
                value: pageIndex,
                set: setPageIndex,
            },
            add: async () => {
                tmpId.current = getTmpId();
                setPages((prev) => [
                    ...prev,
                    {
                        tmp_id: tmpId.current,
                        _id: '',
                        section: sectionId,
                        title: 'New Page',
                        data: '',
                    },
                ]);

                createDefaultPageMutation.mutate(tmpId.current);
            },
            remove: () => {
                const pageId = pages[pageIndex]?._id;

                if (!pageId) {
                    return;
                }

                if (pages.length === 1) {
                    // if only one page, clear the page and update the page
                    const clearedPage = { ...pages[pageIndex], data: '' } as PageInterface;
                    setPages([clearedPage]);
                    updatePage(pageId, { _id: pageId, section: sectionId, data: '' });
                    return;
                }

                setPages((prev) => prev.filter((page) => page._id !== pageId));
                setPageIndex(pages.length > 1 ? pages.length - 2 : 0);

                deletePageMutation.mutate(pageId);
            },
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
            // console.log('@@Front - pagesRequest.data:', pagesRequest.data);
            // console.log('@@Front - resumeRequest.data:', resumeRequest.data);
            // console.log('@@Front - noteRequest.data:', noteRequest.data);

            setPages(pagesRequest.data as PageInterface[]);
            setChat(chatRequest.data as ChatResponse[]);
            setResume(resumeRequest.data as ResumeResponse);
            setNote(noteRequest.data as NoteResponse);
            setDirectory(directoryRequest as DirectoryResponse);

            console.log('@@Front - pages state after set:', pagesRequest.data);
        }
    }, [haveSection]); // Remove pageIndex from dependencies

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
