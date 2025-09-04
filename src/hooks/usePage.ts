import { useDispatch, useSelector } from 'react-redux';
import { GlobalState, setCurrentPage, setNextPage, setPreviousPage } from '../store/global';
import { directorySelector, globalSelector, State, userSelector } from '../store/selector';
import { Page } from '../interface.global';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserState } from '../store/user';
import { CurrentItemId, DirectoryState } from '../store/directory';
import { useEffect, useCallback } from 'react';

export const usePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);
    const directory = useSelector<State, DirectoryState>(directorySelector);

    // Fonction pour déterminer la page à partir de l'URL
    const getPageFromURL = useCallback((pathname: string): Page => {
        const pathSegments = pathname.split('/').filter((segment) => segment !== '');

        if (pathSegments.length === 0) return Page.Dashboard;

        const firstSegment = pathSegments[0];

        switch (firstSegment) {
            case 'dashboard':
                return Page.Dashboard;
            case 'courses':
                return Page.Courses;
            case 'chapters':
                return Page.Chapters;
            case 'sections':
                return Page.Sections;
            case 'section':
                return Page.Section;
            case 'social':
                return Page.Social;
            case 'profile':
                return Page.Profile;
            case 'blocker':
                return Page.Blocker;
            case 'settings':
                return Page.Settings;
            default:
                return Page.Dashboard;
        }
    }, []);

    // Synchroniser l'état Redux avec l'URL courante
    const syncPageWithURL = useCallback(() => {
        const currentPageTitle = getPageFromURL(location.pathname);

        // Mettre à jour l'état Redux seulement si la page a changé
        if (global.page.current.title !== currentPageTitle) {
            console.log('Syncing page state:', global.page.current.title, '->', currentPageTitle);
            dispatch(setCurrentPage({ title: currentPageTitle }));
        }
    }, [location.pathname, global.page.current.title, dispatch, getPageFromURL]);

    // Synchroniser à chaque changement de location
    useEffect(() => {
        syncPageWithURL();
    }, [syncPageWithURL]);

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

    // Fonction pour naviguer en arrière avec synchronisation automatique
    const navigateBack = useCallback(() => {
        navigate(-1);
        // La synchronisation se fera automatiquement via le useEffect
    }, [navigate]);

    // Fonction pour naviguer vers une URL spécifique avec synchronisation
    const navigateTo = useCallback(
        (to: string) => {
            navigate(to);
            // La synchronisation se fera automatiquement via le useEffect
        },
        [navigate],
    );

    return {
        handleGoToNext,
        handleGoToPrevious,
        handleBackToCourses,
        syncPageWithURL,
        navigateBack,
        navigateTo,
        getPageFromURL,
        currentPage: global.page.current.title,
    };
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
