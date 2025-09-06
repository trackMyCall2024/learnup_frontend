import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { globalSelector, State, userSelector } from '../store/selector';
import { GlobalState, setDeleteModalOpen, setErrorModalOpen } from '../store/global';
import { UserState } from '../store/user';
import { checkDirectoryExists, getDirectory, getHistory, getRows } from '../protocol/api';
import { Page } from '../interface.global';
import { getHistoryType, getDirectoryType, getCurrentPageFromURL } from '../utils/utils';
import { Row } from '../Page/Course/interface.directory';
import { useEffect } from 'react';

export const useDirectoryData = (
    filterSearch: string,
    pagination: { page: number; limit: number },
    halfPageIsOpen?: boolean,
    idFromHalfPage?: string,
) => {
    const { id: idFromUrl } = useParams();
    const location = useLocation();

    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);
    const dispatch = useDispatch();
    const parentId = idFromHalfPage ?? (idFromUrl as string);

    // Amélioration : déterminer la page courante de manière plus robuste
    const currentPage = halfPageIsOpen
        ? (global.page.next.title as string)
        : getCurrentPageFromURL(location.pathname);

    // Query pour les rows
    const rows = useQuery<Row[]>({
        queryKey: [
            'getRows',
            parentId,
            filterSearch,
            pagination.page,
            pagination.limit,
            location.pathname,
            getCurrentPageFromURL(location.pathname),
        ],
        queryFn: () =>
            getRows(
                getDirectoryType(currentPage),
                parentId,
                filterSearch,
                pagination.page,
                pagination.limit,
            ),
        enabled: !!parentId,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    // Query pour l'historique
    const history = useQuery<Row[]>({
        queryKey: ['getHistory', currentPage, location.pathname, user._id],
        queryFn: () => getHistory(getHistoryType(currentPage), user._id),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        enabled: currentPage === Page.Courses && !!user._id,
        staleTime: 0,
    });

    const { data: directoryExists, isLoading: isDirectoryExistsLoading } = useQuery({
        queryKey: ['checkDirectoryExists', parentId],
        queryFn: () => checkDirectoryExists(parentId),
        enabled: !!parentId,
        staleTime: 0,
    });

    return {
        directoryExists,
        rows,
        history,
        currentPage,
        parentId,
        isLoading: rows.isLoading || history.isLoading || isDirectoryExistsLoading,
        isError: rows.isError || history.isError,
    };
};
