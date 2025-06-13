import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from "react-redux";
import { GlobalState, setPage } from "../../store/global";
import { globalSelector, State, userSelector } from "../../store/selector";
import { UserState } from "../../store/user";
import Ellipsis from "../atoms/Ellipsis";

const Navbar = () => {
    const dispatch = useDispatch();
    const global = useSelector<State, GlobalState>(globalSelector);
    const user = useSelector<State, UserState>(userSelector);
    const name = `${user.firstname} ${user.lastname}`;

    return (
        <Stack
            height={"100vh"}
            minWidth={"280px"}
            flexDirection={"column"}
            alignItems={"center"}
            sx={{ backgroundColor: (theme) => theme.palette.background.default }}
        >
            <Box
                sx={{
                    height: 60,
                    maxWidth: "75%",
                    my: 4,
                    px: 2,
                    backgroundColor: "#1D1D1D",
                    borderRadius: 2,
                    border: (th) => `1px solid ${th.palette.grey['700']}`,
                    gap: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Stack 
                    minHeight={35} 
                    minWidth={35}
                    borderRadius={'50%'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{ backgroundColor: (th) => th.palette.primary['300']}}
                >
                    {user.firstname?.[0] ?? ''}
                </Stack>
                <Stack maxWidth={'inherit'} display={'flex'} flexDirection={'column'} sx={{ color: (th) => th.palette.background.paper }}>
                    <Ellipsis title={name}>{name}</Ellipsis>
                    <Ellipsis title={user.email} fontSize={'12px'} sx={{ textDecoration: 'underline' }}>{user.email}</Ellipsis>
                </Stack>
            </Box>
            <List
                sx={{
                    borderRadius: 10,
                    width: "85%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {navList.map((item, i) => {
                    return (
                        <ListItem
                            key={i}
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                display: "flex",
                                justifyContent: "center",
                            }}
                            disablePadding
                            onClick={() => dispatch(setPage({ title: item.text, index: i }))}
                        >
                            <ListItemButton
                                component={Link}
                                to={item.link}
                                sx={{
                                    backgroundColor: (th) => (global.page.index === i ? "#1D1D1D" : "#111111"),
                                    borderRadius: 2,
                                    py: 1.5,
                                    ":hover": {
                                        backgroundColor: "#171717",
                                    },
                                    gap: 2
                                }}
                            >
                                <ListItemIcon 
                                    sx={{ 
                                        color: (th) => th.palette.grey['300'], 
                                        height: 20, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'flex-start', 
                                        minWidth: '0' 
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
                                    {item.text}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Stack>
    );
};

const navList = [
    { text: "Dashboard", link: "/dashboard", icon: <FontAwesomeIcon icon={faGraduationCap} style={{ stroke: "#CCCCCC", strokeWidth: 20, color: "transparent" }} /> },
    { text: "Courses", link: "/courses", icon: <FontAwesomeIcon icon={faBook} style={{ stroke: "#CCCCCC", strokeWidth: 20, color: "transparent" }} /> },
    { text: "Social",  link: "/social", icon: <FontAwesomeIcon icon={faUsers} style={{ stroke: "#CCCCCC", strokeWidth: 20, color: "transparent" }} /> },
    { text: "Profile", link: "/profile", icon: <FontAwesomeIcon icon={faUser} style={{ stroke: "#CCCCCC", strokeWidth: 20, color: "transparent" }} /> },
    { text: "Blocker", link: "/blocker", icon: <FontAwesomeIcon icon={faBan} style={{ stroke: "#CCCCCC", strokeWidth: 20, color: "transparent" }} /> },
    { text: "Settings", link: "/settings", icon: <FontAwesomeIcon icon={faGear} style={{ stroke: "#CCCCCC", strokeWidth: 20, color: "transparent" }} /> },
];

export default Navbar;
