import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";

interface Purple {
    main: string
}

declare module "@mui/material/styles" {
    interface Palette {
        purple: Purple;
    }

    interface PaletteOptions {
        purple?: Purple;
    }
}

export let themeMui = createTheme({
    palette: {
        primary: {
            "50":  "#f7f7f7", // très clair
            "100": "#ededed",
            "200": "#e3e3e3",
            "300": "#d9d9d9",
            "400": "#d6d6d6",
            "500": "#D4D4D4", // base
            "600": "#a9a9a9",
            "700": "#7e7e7e",
            "800": "#535353",
            "900": "#2b2b2b",
            light: "#f7f7f7",
            main: "#D4D4D4",
        },
        text: {
            primary: "#111111",
            secondary: "#111111",
        },
        // info: {
        //     main: "#4270A7",
        //     contrastText: "#fff",
        // },
        // warning: {
        //     main: "#F59C0C",
        //     contrastText: "#fff",
        // },
        // error: {
        //     light: "#E09B97",
        //     main: "#A74242",
        //     contrastText: "#fff",
        // },
        grey: {
            "50": "#FAFAFA",
            "100": "#F5F5F5",
            "200": "#EFEFEF",
            "300": "#CCCCCC", // ← ton gris clair
            "400": "#AAAAAA", // ← ton gris moyen
            "500": "#888888",
            "600": "#535353",
            "700": "#313131", // ← ton gris foncé
            "800": "#1f1f1f",
            "900": "#171717", // ← ton gris très foncé
        },
        purple: {
            main: '#CED7FF'
        },
        background: {
            default: "#111111",
            paper: "#FEFEFE",
        },
    },
    typography: {
        body1: {
            fontSize: "14px",
            color: "#111111",
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {

                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    border: `1px solid ${theme.palette.primary['500']}`,
                    borderRadius: 2,
                    padding: 2,
                }),
            },
        }
    },
});
