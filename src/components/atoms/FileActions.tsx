import {
    faArrowDown,
    faExpand,
    faFileLines,
    faShareNodes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Stack } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CustomBtn from './CustomBtn';
import { Row } from '../../Page/Course/interface.directory';
import { RowPage, setIsHalfPageIsOpen } from '../../store/global';
import { setCurrentHistory, setCurrentItem } from '../../store/directory';
import { getNextPage } from '../../hooks/usePage';
import { Page } from '../../interface.global';
import { setNextPage } from '../../store/global';
import { useDispatch } from 'react-redux';
import { usePage } from '../../hooks/usePage';
import { useNavigate } from 'react-router-dom';

interface FileActionProps {
    page: Page;
    row?: Row;
    size?: 'sm' | 'xs';
    localHalfPageIsOpen?: boolean;
}

const FileAction = ({ size, row, localHalfPageIsOpen, page }: FileActionProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleGoToNext } = usePage();

    const historyType = page as string;

    const handleClick = () => {
        if (page === Page.Section || !row) {
            return;
        }

        console.log('@@Front - handleClick');
        dispatch(
            setNextPage({
                _id: row._id as string,
                title: getNextPage(page) as RowPage,
                isOpen: page === Page.Sections ? false : true,
            }),
            dispatch(
                setCurrentHistory({
                    type: historyType,
                    data: row,
                }),
            ),
            dispatch(
                setCurrentItem({
                    [page]: row._id,
                }),
            ),
        );
        if (page === Page.Sections) {
            handleGoToNext(() => navigate(`/section/${row._id}`));
        } else {
            dispatch(setIsHalfPageIsOpen(true));
        }
    };
    return (
        <Stack
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={2}
        >
            <Button
                size="small"
                color="info"
                variant="contained"
                sx={{
                    display: localHalfPageIsOpen || page === Page.Section ? 'none' : 'flex',
                    borderRadius: 2,
                    fontSize: 10,
                }}
                startIcon={<FontAwesomeIcon size="xs" icon={faExpand} fontSize={1} />}
                disabled={!row?._id}
                onClick={() => handleClick()}
            >
                Open
            </Button>
            <CustomBtn
                sx={{
                    p: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ShareIcon
                    sx={{ fontSize: size === 'xs' ? '12px' : '14px', height: 14, width: 14 }}
                />
            </CustomBtn>
            <CustomBtn>
                <FontAwesomeIcon
                    icon={faArrowDown}
                    fontSize={size === 'xs' ? '12px' : '14px'}
                    style={{ height: 14, width: 14 }}
                />
            </CustomBtn>
        </Stack>
    );
};

export default FileAction;
