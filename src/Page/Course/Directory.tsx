import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { globalSelector, State } from '../../store/selector';
import { GlobalState, setErrorModalOpen } from '../../store/global';
import { Stack } from '@mui/material';
import Search from '../../components/atoms/Search';
import { createDirectory, getDirectory } from '../../protocol/api';
import { Page } from '../../interface.global';
import RenderWhen from '../../components/atoms/RenderWhen';
import Rows from '../../components/atoms/Rows';
import { Row } from './interface.directory';
import RightNavbar from '../../components/atoms/RightNavbar';
import { getDirectoryType } from '../../utils/utils';
import { usePage } from '../../hooks/usePage';
import { useDirectoryData } from '../../hooks/useDirectoryData';
import { useMutation } from '@tanstack/react-query';
import { DirectoryRequest } from '../../protocol/api.type';

interface DirectoryProps {
    halfPageIsOpen?: boolean;
    idFromHalfPage?: string;
    headerFromHalfPage?: JSX.Element;
}

export interface RowWithTmpId extends Row {
    tmp_id?: string;
}

const Directory = ({ halfPageIsOpen, idFromHalfPage, headerFromHalfPage }: DirectoryProps) => {
    const [pagination, setPagination] = useState({ page: 1, limit: 20 });
    const [localRows, setLocalRows] = useState<RowWithTmpId[]>([]);
    const [filterSearch, setFilterSearch] = useState<string>('');

    const global = useSelector<State, GlobalState>(globalSelector);
    const tempId = useRef<string>('');

    // STORE
    const dispatch = useDispatch();
    const { currentPage } = usePage();

    // Utiliser le hook personnalisé pour les données
    const { directoryExists, rows, history, parentId, isLoading } = useDirectoryData(
        filterSearch,
        pagination,
        halfPageIsOpen,
        idFromHalfPage,
    );

    useEffect(() => {
        console.log('@@dd isLoading', isLoading);
        console.log('@@dd directoryExists', directoryExists);
        if (isLoading === false && directoryExists === false) {
            dispatch(
                setErrorModalOpen({
                    isOpen: true,
                    title: 'Not found',
                    message: 'The directory cannot be found or has been deleted',
                }),
            );
        }
    }, [directoryExists, dispatch, isLoading]);

    const newRow = (): DirectoryRequest => {
        return {
            parentID: parentId,
            type: getDirectoryType(currentPage),
            name: `New ${getDirectoryType(currentPage)}`,
            logo: undefined,
        };
    };

    const createDirectoryMutation = useMutation({
        mutationFn: (tempId: string) => {
            const newRowWithId: RowWithTmpId = { ...newRow(), _id: undefined, tmp_id: tempId };
            setLocalRows([...localRows, newRowWithId]);
            return createDirectory(newRow(), tempId);
        },
        onSuccess: (data) => {
            const createdRowWithId: RowWithTmpId = { ...data.directory, _id: data.directory._id, tmp_id: data.tmp_id };
            const haveRowWithTmpId = localRows.some((row) => row.tmp_id === data.tmp_id);
            console.log('@@dd haveRowWithTmpId', haveRowWithTmpId, data.tmp_id, localRows);
            if (haveRowWithTmpId) {
                setLocalRows(
                    localRows.map((row) => (row.tmp_id === data.tmp_id ? createdRowWithId : row)),
                );
            }
        },
        onError: (error) => {
            const haveRowWithTmpId = localRows.some((row) => row.tmp_id === tempId.current);
            if (haveRowWithTmpId) {
                setLocalRows(localRows.filter((row) => row.tmp_id !== tempId.current));
                console.log('Error - Row not created', error);
            }
        },
    });

    const handleCreateRow = () => {
        tempId.current = Math.random().toString(36).substring(2, 15);
        createDirectoryMutation.mutate(tempId.current);
    };

    const haveRows = !rows.isLoading && !!rows.data;
    const haveHistory = !!history.data && (history.data as Row[]).length > 0;
    const canOpenRightNavbar = !halfPageIsOpen && currentPage !== Page.Courses;

    // Reset filter search and pagination when URL changes
    useEffect(() => {
        setFilterSearch('');
        setPagination({ page: 1, limit: 20 });
        setLocalRows([]);
    }, [parentId, canOpenRightNavbar]);

    useEffect(() => {
        if (rows.data) {
            setLocalRows(rows.data as Row[]);
        }
    }, [rows.data]);

    return (
        <Stack display={'flex'} flex={1} flexDirection={'row'} gap={canOpenRightNavbar ? 5 : 0}>
            <Stack
                display={'flex'}
                flexDirection={'column'}
                width={halfPageIsOpen ? '-webkit-fill-available' : '70%'}
            >
                <RenderWhen if={halfPageIsOpen}>{headerFromHalfPage}</RenderWhen>
                <Stack p={idFromHalfPage ? '30px' : 0} gap={5}>
                    <Search inputValue={filterSearch} setInputValue={setFilterSearch} />
                    <RenderWhen if={haveHistory && currentPage === Page.Courses}>
                        <Rows headerTitle={'History'} rowsData={history.data as Row[]} />
                    </RenderWhen>
                    <RenderWhen if={haveRows}>
                        <Rows
                            currentPage={currentPage as Page}
                            headerTitle={`All ${
                                headerFromHalfPage
                                    ? (global.page.next.title as Page)
                                    : currentPage
                            }`}
                            rowsData={localRows}
                            localHalfPageIsOpen={!!halfPageIsOpen}
                            handkeCreateRow={handleCreateRow}
                        />
                    </RenderWhen>
                </Stack>
            </Stack>
            <RenderWhen if={canOpenRightNavbar}>
                <RightNavbar />
            </RenderWhen>
        </Stack>
    );
};

export default Directory;
