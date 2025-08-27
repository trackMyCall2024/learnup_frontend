import { Button, Stack } from "@mui/material";
import { GlobalState, setNavbarEnlarged } from "../../store/global";
import { useDispatch, useSelector } from "react-redux";
import { globalSelector, State } from "../../store/selector";

const BtnExpandNavbar = ({ isHeader = false }: { isHeader?: boolean }) => {
    const dispatch = useDispatch();
    const global = useSelector<State, GlobalState>(globalSelector);

    const bouton = (isHeader: boolean) => {
        return (
            <Button
                id={isHeader ? 'btn-expand-navbar-header' : 'btn-expand-navbar'}
                variant="contained"
                color="info"
                size="small"
                sx={{
                    // DIMENSIONS
                    height: '15px',
                    p: 0,
                    minWidth: '20px',
                    maxWidth: '20px',
                    // DISPLAY
                    display: isHeader ? 'none' : 'flex',
                    alignSelf: isHeader ? 'initial' : 'flex-start',
                    alignItems: 'center',
                    justifyContent: 'start',
                    // MARGIN
                    marginRight: isHeader ? 2 : 0,
                    mt: isHeader ? 0 : 2,
                    // CUSTOM
                    boxShadow: isHeader ? 'none' : 'inherit',
                    borderRadius: 0.5,
                    cursor: 'pointer',
                    border: (th) => `1px solid ${th.palette.grey['300']}`,
                    backgroundColor: isHeader ? 'transparent' : 'background.default',
                    '&:hover': {
                        backgroundColor: isHeader ? 'transparent' : 'background.default',
                        boxShadow: isHeader ? 'none' : 'inherit',
                    },
                }}
                onClick={() => dispatch(setNavbarEnlarged(!global.navbar.isEnlarged))}
            >
                <Stack
                    height={'100%'}
                    width={'30%'}
                    sx={{ borderRight: (th) => `1.5px solid ${th.palette.grey['300']}` }}
                ></Stack>
            </Button>
        );
    }

    if (isHeader) {
        return (
            <Stack id="btn-expand-navbar-header-container" mr={2}>
                {bouton(isHeader)}
            </Stack>
        )
    } else {
        return bouton(isHeader);
    }
};

export default BtnExpandNavbar;
