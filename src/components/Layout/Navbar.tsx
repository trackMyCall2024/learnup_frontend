import { Box, List, ListItem, ListItemButton, ListItemIcon, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [listItemIndex, setListItemIndex] = React.useState<number>(0);

    return (
        <Stack
            height={"100vh"}
            flexDirection={"column"}
            alignItems={"center"}
            sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
        >
            <Box
                height={50}
                width={"auto"}
                my={7}
                sx={{ backgroundColor: (th) => th.palette.primary.light, borderRadius: 5 }}
            >
                <img
                    draggable={false}
                    src={`${process.env.PUBLIC_URL}/logo/logo3.svg`}
                    alt="phone logo navbar"
                    loading="lazy"
                />
            </Box>
            <List
                sx={{
                    borderRadius: "50%",
                    width: "60px",
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
                                backgroundColor: (th) => (listItemIndex === i ? th.palette.primary.light : "none"),
                                borderRadius: 2,
                                // borderLeft: (th) =>
                                //     `5px solid ${
                                //         listItemIndex === i ? th.palette.primary.main : th.palette.background.paper
                                //     }`,
                                ":hover": {
                                    backgroundColor: "#E5F9F2",
                                    "& *": { color: (th) => th.palette.primary.main },
                                },
                                maxWidth: "5",
                                display: "flex",
                                justifyContent: "center",
                            }}
                            disablePadding
                            onClick={() => setListItemIndex(i)}
                        >
                            <ListItemButton
                                component={Link}
                                to={item.link}
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: (th) =>
                                            listItemIndex === i ? th.palette.primary.main : th.palette.text.secondary,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Stack>
    );
};

const navList = [
    { text: "Test", icon: <SearchIcon />, link: "/test" },
];

export default Navbar;
