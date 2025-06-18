import { useDispatch, useSelector } from 'react-redux';
import { GlobalState, setCurrentPage, setNextPage, setPreviousPage } from '../store/global';
import { directorySelector, globalSelector, State, userSelector } from '../store/selector';
import { Page } from '../interface.global';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../store/user';
import { CurrentItemId, DirectoryState } from '../store/directory';

export const usePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);
    const directory = useSelector<State, DirectoryState>(directorySelector);

    const previousPage = `${global.page.current.title}` as Page;
    const nextPage = (
        global.page.next.title
            ? `${global.page.next.title}`
            : getNextPage(global.page.current.title)
    ) as Page;
    const previousId =
        global.page.current.title === Page.Courses
            ? user._id
            : directory.currentItemId[previousPage as keyof CurrentItemId];

    const resetPageStore = () => {
        dispatch(setNextPage({ _id: '', title: null, isOpen: false }));
        dispatch(setPreviousPage({ _id: '', title: null }));
    };

    const setPageStore = (handleType: 'previous' | 'next') => {
        if (handleType === 'next') {
            dispatch(setCurrentPage({ title: nextPage }));
        } else {
            dispatch(setCurrentPage({ title: previousPage }));
        }
        dispatch(setPreviousPage({ _id: previousId, title: previousPage }));
    };

    const handleGoToNext = (onEnd?: () => void) => {
        setPageStore('next');
        dispatch(setNextPage({ _id: '', title: null, isOpen: false }));

        if (onEnd) {
            onEnd();
        }
    };

    const handleGoToPrevious = (onEnd?: () => void) => {
        setPageStore('previous');

        if (onEnd) {
            onEnd();
        }
    };

    const handleBackToCourses = (onEnd?: () => void) => {
        resetPageStore();
        dispatch(setCurrentPage({ title: previousPage }));
        navigate(`courses/${user._id}`);

        if (onEnd) {
            onEnd();
        }
    };

    return { handleGoToNext, handleGoToPrevious, handleBackToCourses };
};

export function getNextPage(currentPage: Page): Page | null {
    switch (currentPage) {
        case Page.Courses:
            return Page.Chapters;

        case Page.Chapters:
            return Page.Sections;

        case Page.Sections:
            return Page.Section;

        default:
            return null;
    }
}
