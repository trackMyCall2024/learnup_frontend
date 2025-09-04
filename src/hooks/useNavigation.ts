import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/global';
import { Page } from '../interface.global';
import { useCallback, useEffect } from 'react';

export const useNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

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
        dispatch(setCurrentPage({ title: currentPageTitle }));
    }, [location.pathname, dispatch, getPageFromURL]);

    // Synchroniser à chaque changement de location
    useEffect(() => {
        syncPageWithURL();
    }, [syncPageWithURL]);

    // Fonction pour naviguer en arrière avec synchronisation automatique
    const navigateBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // Fonction pour naviguer vers une URL spécifique avec synchronisation
    const navigateTo = useCallback(
        (to: string) => {
            navigate(to);
        },
        [navigate],
    );

    // Fonction pour naviguer vers une URL spécifique avec remplacement (pas d'historique)
    const navigateReplace = useCallback(
        (to: string) => {
            navigate(to, { replace: true });
        },
        [navigate],
    );

    return {
        navigateBack,
        navigateTo,
        navigateReplace,
        syncPageWithURL,
        getPageFromURL,
        currentPath: location.pathname,
    };
};
