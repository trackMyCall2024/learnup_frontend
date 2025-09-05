import { useDispatch, useSelector } from 'react-redux';
import { setNextPage } from '../store/global';
import { Page } from '../interface.global';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { State } from '../store/selector';
import { UserState } from '../store/user';
import { userSelector } from '../store/selector';

export const usePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const currentPage = window.location.pathname.split('/')[1] as Page;
    const currentId = window.location.pathname.split('/')[2] as Page;
    const user = useSelector<State, UserState>(userSelector);

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
        if (currentPage !== currentPageTitle) {
            console.log('Syncing page state:', currentPage, '->', currentPageTitle);
        }
    }, [location.pathname, currentPage, dispatch, getPageFromURL]);

    // Synchroniser à chaque changement de location
    useEffect(() => {
        syncPageWithURL();
    }, [syncPageWithURL]);

    const previousPage = `${currentPage}` as Page;

    const resetPageStore = () => {
        dispatch(setNextPage({ _id: '', title: null, isOpen: false }));
    };

    const handleGoToNext = (onEnd?: () => void) => {
        dispatch(setNextPage({ _id: '', title: null, isOpen: false }));

        if (onEnd) {
            onEnd();
        }
    };

    const handleGoToPrevious = (onEnd?: () => void) => {
        if (onEnd) {
            onEnd();
        }
    };

    const handleBackToCourses = (onEnd?: () => void) => {
        resetPageStore();
        // Ne pas changer la page courante automatiquement, laisser la navigation se faire naturellement
        navigate(`/courses/${user._id}`);

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

    const getPreviousPage = (): Page | null => {
        if (!currentPage) {
            handleBackToCourses();
            return null;
        }

        switch (currentPage) {
            case Page.Dashboard:
                return Page.Dashboard;
            case Page.Courses:
                return Page.Dashboard;
            case Page.Chapters:
                return Page.Courses;
            case Page.Sections:
                return Page.Chapters;
            case Page.Section:
                return Page.Sections;
            default:
                return Page.Dashboard;
        }
    };

    return {
        handleGoToNext,
        handleGoToPrevious,
        handleBackToCourses,
        syncPageWithURL,
        navigateBack,
        navigateTo,
        getPageFromURL,
        getPreviousPage,
        currentPage: currentPage as Page,
        currentId: currentId as string,
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
