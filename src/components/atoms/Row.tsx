import { Row as RowInterface } from '../../Page/Course/interface.directory';
import { debounce, Stack, TextField } from '@mui/material';
import Box from './Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChess } from '@fortawesome/free-solid-svg-icons';
import { GlobalState } from '../../store/global';
import { useSelector } from 'react-redux';
import { globalSelector, State } from '../../store/selector';
import RenderWhen from './RenderWhen';
import FileAction from './FileActions';
import { useCallback, useState, useRef } from 'react';
import { updateDirectory } from '../../protocol/api';
import { RowWithTmpId } from '../../Page/Course/Directory';
import { usePage } from '../../hooks/usePage';
import { useQueryClient } from '@tanstack/react-query';

export enum RowType {
    History = 'history',
    List = 'list',
}

interface RowProps {
    rowType: RowType;
    row: RowInterface | RowWithTmpId;
    localHalfPageIsOpen?: boolean;
}

export enum HistoryType {
    Course = 'courses',
    Chapter = 'chapters',
    Section = 'sections',
}

const Row = ({ rowType, row, localHalfPageIsOpen }: RowProps) => {
    const global = useSelector<State, GlobalState>(globalSelector);
    const { currentPage } = usePage();
    const queryClient = useQueryClient();
    const [text, setText] = useState(row.name);
    const textFieldRef = useRef<HTMLInputElement>(null);

    const debouncedUpdate = useCallback(
        debounce((newText: string) => {
            updateDirectory(row._id as string, {
                name: newText,
                parentID: row.parentID,
                logo: row.logo,
                type: row.type,
            });
            if (global.recorder.isOpen) {
                queryClient.invalidateQueries({ queryKey: ['load-courses'] });
                queryClient.invalidateQueries({ queryKey: ['load-chapters'] });
            }
        }, 500), // 500ms après la dernière frappe
        [row._id, row.parentID, row.logo, row.type],
    );

    const handleUpdateTextRow = (newText: string) => {
        setText(newText);
        if (row._id) {
            debouncedUpdate(newText);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                justifyContent: rowType === RowType.List ? 'space-between' : 'flex-start',
                width: rowType === RowType.List ? '-webkit-fill-available' : '30%',
                // cursor: global.page.next.isOpen ? 'default' : 'pointer',
                ':hover': {
                    backgroundColor: global.page.next.isOpen
                        ? 'initial'
                        : 'rgba(250, 250, 250, 0.7)',
                },
            }}
            onClick={() => {
                if (global.page.next.isOpen) {
                    return;
                }
            }}
        >
            <Stack
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                gap={2}
                sx={{ flex: 1, position: 'relative' }}
            >
                <FontAwesomeIcon icon={faChess} />
                <TextField
                    ref={textFieldRef}
                    id="standard-basic"
                    // label={row.name}
                    placeholder={`${row.type} name...`}
                    variant="standard"
                    value={text}
                    onChange={(e) => handleUpdateTextRow(e.target.value)}
                    autoFocus={!!(row as RowWithTmpId).tmp_id}
                    sx={{
                        flex: 1,
                        '& .MuiInput-underline:before': {
                            borderBottom: 'none',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottom: (th) => `0.5px solid ${th.palette.grey['400']}`,
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottom: 'none',
                        },
                        '& .MuiInputBase-root': {
                            border: 'none',
                        },
                    }}
                />
            </Stack>
            <RenderWhen if={rowType === RowType.List}>
                <FileAction
                    size={'xs'}
                    localHalfPageIsOpen={localHalfPageIsOpen}
                    row={row}
                    page={currentPage}
                />
            </RenderWhen>
        </Box>
    );
};

export default Row;
