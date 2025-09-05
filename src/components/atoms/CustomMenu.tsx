import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Stack } from '@mui/material';
import { Text } from './Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { setDeleteModalContent, setDeleteModalClose, setDeleteModalOpen } from '../../store/global';
import { useDispatch } from 'react-redux';
import { DirectoryType } from '../../Page/Course/interface.directory';
import { getDirectoryByPage, getDirectoryType, getPageName } from '../../utils/utils';
import { Page } from '../../interface.global';
import { useQuery } from '@tanstack/react-query';
import { getDirectory } from '../../protocol/api';
import { useLocation } from 'react-router-dom';

const CustomMenu = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0); // Changé de 1 à 0
    const open = Boolean(anchorEl);

    const directoryType = getDirectoryByPage(location.pathname.split('/')?.[1]);
    const parentId = location.pathname.split('/').pop();

    console.log('@@@@directoryType', directoryType);
    console.log('@@@@parentId', parentId);

    const { data: parentDirectory, error: parentDirectoryError } = useQuery({
        queryKey: ['parentDirectory', parentId],
        queryFn: () => getDirectory(parentId as string),
        enabled: !!parentId && !!directoryType,
        retry: false, // Ne pas retry en cas d'erreur 404
    });

    console.log('@@@@parentDirectory', parentDirectory);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        console.log('index', index);
        // Ajoutez ici votre logique pour l'action "Remove"
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenDeleteModal = () => {
        if (!parentDirectory) {
            console.error('Parent directory not found');
            return;
        }
        console.log('parentDirectory', parentDirectory);
        dispatch(
            setDeleteModalContent({
                _id: parentDirectory._id as string,
                name: parentDirectory.name as string,
                type: parentDirectory.type as DirectoryType,
            }),
        );
        dispatch(setDeleteModalOpen(true));
    };

    const handleCloseDeleteModal = () => {
        dispatch(setDeleteModalClose());
    };

    const options = [
        <Text
            display={'flex'}
            alignItems={'center'}
            gap={1}
            py={1}
            onClick={handleOpenDeleteModal}
            sx={{ width: '100%', height: '100%', borderRadius: 1 }}
        >
            <DeleteOutlineIcon sx={{ fontSize: '18px', ml: 1 }} />
            <Text>Delete</Text>
        </Text>,
    ];

    // Ne pas afficher le menu si le répertoire parent n'est pas trouvé
    if (parentDirectoryError) {
        console.log('Parent directory error:', parentDirectoryError);
        // return null;
    }

    return (
        <Stack
            sx={{
                position: 'absolute',
                top: 0,
                right: 0,
            }}
            m={2}
        >
            <List component="nav" aria-label="Device settings" sx={{ bgcolor: 'background.paper' }}>
                <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="..."
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                    sx={{
                        p: 0,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        // border: (th) => `1px solid ${th.palette.grey[500]}`,
                        color: (th) => th.palette.text.primary,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: open ? (th) => th.palette.grey[100] : 'transparent',
                    }}
                >
                    <FontAwesomeIcon size="lg" icon={faEllipsis} />
                </ListItemButton>
            </List>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                    m: 1,
                    px: 4,
                    '& .MuiPaper-root': {
                        px: 2,
                        py: 0.5,
                    },
                }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={index}
                        // disabled={index === 0} // Supprimé cette ligne
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        sx={{
                            minWidth: '150px',
                            p: 0,
                            borderRadius: 1,
                            color: (th) => th.palette.text.primary,
                            cursor: 'pointer', // Ajouté le curseur pointeur
                            '&:hover': {
                                '& .MuiSvgIcon-root, & .MuiTypography-root': {
                                    color:
                                        index === 0
                                            ? (th) => th.palette.error.main
                                            : (th) => th.palette.text.primary,
                                },
                            },
                        }}
                    >
                        <Stack
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 1,
                                // '&:hover': {
                                //     backgroundColor: 'red',
                                // },
                            }}
                        >
                            {option}
                        </Stack>
                    </MenuItem>
                ))}
            </Menu>
        </Stack>
    );
};

export default CustomMenu;
