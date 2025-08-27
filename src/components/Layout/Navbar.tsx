import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Switch,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
    GlobalState,
    setCurrentPage,
    setIsRecorderOpen,
} from '../../store/global';
import { globalSelector, State, userSelector } from '../../store/selector';
import { UserState } from '../../store/user';
import { Page } from '../../interface.global';
import Ellipsis from '../atoms/Ellipsis';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import BtnExpandNavbar from '../atoms/BtnExpandNavbar';

const Navbar = () => {
    const dispatch = useDispatch();
    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);

    const name = `${user.firstname} ${user.lastname}`;
    const navbarRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const fixWidth = '240px';

    useEffect(() => {
        if (!global.navbar.isEnlarged) {
            // Animation fluide : réduire la largeur à 0px
            gsap.to(navbarRef.current, {
                width: '0px',
                duration: 0.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    if (navbarRef.current) {
                        // navbarRef.current.style.display = 'none';
                    }
                },
            });

            // Second animation
            // Animer les éléments internes (btn, box, list) avec opacité 0 en 0.2s
            gsap.to(['#btn-expand-navbar', boxRef.current, listRef.current], {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    if (boxRef.current) boxRef.current.style.display = 'none';
                    if (listRef.current) listRef.current.style.display = 'none';
                },
            });

            gsap.to(navbarRef.current, {
                paddingLeft: '0px',
                paddingRight: '0px',
                duration: 0.2,
                ease: 'power2.inOut',
            });
        } else {
            // Réinitialiser la largeur quand la navbar est agrandie
            if (navbarRef.current) {
                gsap.to(navbarRef.current, {
                    width: fixWidth,
                    duration: 0.2,
                    ease: 'power2.inOut',
                    display: 'flex',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    onComplete: () => {
                        gsap.to(['#btn-expand-navbar', boxRef.current, listRef.current], {
                            opacity: 1,
                            display: 'flex',
                            duration: 0.1,
                            ease: 'power2.inOut',
                        });
                    },
                });
            }
        }
    }, [global.navbar.isEnlarged]);

    return (
        <Stack
            height={'100vh'}
            width={fixWidth}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            px={2}
            sx={{
                backgroundColor: (theme) => theme.palette.background.default,
                position: 'relative',
                overflow: 'hidden',
            }}
            ref={navbarRef}
        >
            <BtnExpandNavbar />
            <Box
                ref={boxRef}
                sx={{
                    height: 60,
                    width: '100%',
                    my: 2,
                    backgroundColor: '#1D1D1D',
                    borderRadius: 2,
                    border: (th) => `1px solid ${th.palette.grey['700']}`,
                    gap: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Stack
                    minHeight={35}
                    minWidth={35}
                    borderRadius={'50%'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{ backgroundColor: (th) => th.palette.primary['300'] }}
                >
                    {user.firstname?.[0] ?? ''}
                </Stack>
                <Stack
                    maxWidth={'inherit'}
                    display={'flex'}
                    flexDirection={'column'}
                    sx={{ color: (th) => th.palette.background.paper }}
                >
                    <Ellipsis sx={{ color: (th) => th.palette.background.paper }} title={name}>
                        {name}
                    </Ellipsis>
                    <Ellipsis
                        title={user.email}
                        fontSize={'12px'}
                        sx={{
                            textDecoration: 'underline',
                            color: (th) => th.palette.background.paper,
                        }}
                    >
                        {user.email}
                    </Ellipsis>
                </Stack>
            </Box>
            <List
                ref={listRef}
                sx={{
                    borderRadius: 10,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {navList.map((item, i) => {
                    return (
                        <ListItem
                            key={i}
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                            disablePadding
                            onClick={() => dispatch(setCurrentPage({ title: item.value as Page }))}
                        >
                            <ListItemButton
                                component={Link}
                                to={`${item.value}/${user._id}`}
                                sx={{
                                    backgroundColor: (th) =>
                                        getPageToBeSelected(global.page.current.title) ===
                                        item.value
                                            ? '#1D1D1D'
                                            : '#111111',
                                    borderRadius: 2,
                                    py: 1.5,
                                    ':hover': {
                                        backgroundColor: '#171717',
                                    },
                                    gap: 2,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: (th) => th.palette.grey['300'],
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        minWidth: '0',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        '& .MuiTypography-root': {
                                            color: (th) => th.palette.grey[300],
                                        },
                                    }}
                                >
                                    {item.label}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Box
                sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}
            >
                <Switch
                    defaultChecked={global.recorder.isOpen}
                    onChange={() => dispatch(setIsRecorderOpen(!global.recorder.isOpen))}
                    sx={{
                        '& .MuiSwitch-track': {
                            backgroundColor: (th) => th.palette.white.light,
                        },
                    }}
                />
            </Box>
        </Stack>
    );
};

const navList = [
    {
        label: 'Dashboard',
        value: 'dashboard',
        icon: (
            <FontAwesomeIcon
                icon={faGraduationCap}
                style={{ stroke: '#CCCCCC', strokeWidth: 20, color: 'transparent' }}
            />
        ),
    },
    {
        label: 'Courses',
        value: 'courses',
        icon: (
            <FontAwesomeIcon
                icon={faBook}
                style={{ stroke: '#CCCCCC', strokeWidth: 20, color: 'transparent' }}
            />
        ),
    },
    {
        label: 'Social',
        value: 'social',
        icon: (
            <FontAwesomeIcon
                icon={faUsers}
                style={{ stroke: '#CCCCCC', strokeWidth: 20, color: 'transparent' }}
            />
        ),
    },
    {
        label: 'Profile',
        value: 'profile',
        icon: (
            <FontAwesomeIcon
                icon={faUser}
                style={{ stroke: '#CCCCCC', strokeWidth: 20, color: 'transparent' }}
            />
        ),
    },
    {
        label: 'Blocker',
        value: 'blocker',
        icon: (
            <FontAwesomeIcon
                icon={faBan}
                style={{ stroke: '#CCCCCC', strokeWidth: 20, color: 'transparent' }}
            />
        ),
    },
    {
        label: 'Settings',
        value: 'settings',
        icon: (
            <FontAwesomeIcon
                icon={faGear}
                style={{ stroke: '#CCCCCC', strokeWidth: 20, color: 'transparent' }}
            />
        ),
    },
];

function getPageToBeSelected(page: Page): Page {
    switch (page) {
        case Page.Chapters:
            return Page.Courses;

        case Page.Sections:
            return Page.Courses;

        case Page.Section:
            return Page.Courses;

        default:
            return page;
    }
}

export default Navbar;
