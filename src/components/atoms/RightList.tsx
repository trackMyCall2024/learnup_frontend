import Box from './Box';
import { useDispatch, useSelector } from 'react-redux';
import { directorySelector, globalSelector, State, userSelector } from '../../store/selector';
import { GlobalState, setPreviousPage } from '../../store/global';
import { UserState } from '../../store/user';
import { useQuery } from '@tanstack/react-query';
import { getCapitalizeCase, getController } from '../../utils/utils';
import { getRows } from '../../protocol/api';
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack } from '@mui/material';
import { H4, H5, H6, Text } from './Typography';
import { Page } from '../../interface.global';
import { CurrentItemId, DirectoryState, setCurrentItem } from '../../store/directory';
import { Row } from '../../Page/Course/interface.directory';
import RenderWhen from './RenderWhen';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import CustomBtn from './CustomBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faListUl, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import ToolBox from './ToolBox';
import { PageIndex, SectionProps } from '../../Page/Section/interface.type';

interface RightListProps {
    row: Row;
    index: number;
}

const RightList = ({ row, index }: RightListProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const global = useSelector<State, GlobalState>(globalSelector);
    const directory = useSelector<State, DirectoryState>(directorySelector);

    const previousPage = global.page.previous.title as string;
    const previousItemId = directory.currentItemId[previousPage as keyof CurrentItemId];

    return (
        <Box
            onClick={() => {
                dispatch(
                    setPreviousPage({
                        _id: row._id,
                        title: global.page.previous.title,
                    }),
                );
                dispatch(
                    setCurrentItem({
                        [global.page.previous.title as keyof CurrentItemId]: row._id,
                    }),
                );
                navigate(`/${global.page.current.title}/${row._id}`);
            }}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                gap: 1,
                backgroundColor:
                    row._id === previousItemId ? (th) => th.palette.background.default : 'initial',
                cursor: 'pointer',
                ':hover': {
                    backgroundColor:
                        row._id === previousItemId
                            ? (th) => th.palette.background.default
                            : 'rgba(250, 250, 250, 0.7)',
                },
            }}
        >
            <Text
                sx={{
                    color:
                        row._id === previousItemId
                            ? (th) => th.palette.background.paper
                            : 'initial',
                }}
            >
                {++index}.
            </Text>
            <Text
                sx={{
                    color:
                        row._id === previousItemId
                            ? (th) => th.palette.background.paper
                            : 'initial',
                }}
            >
                {row.name}
            </Text>
        </Box>
    );
};

export default RightList;
