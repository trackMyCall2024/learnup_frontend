import { extendTheme } from "@mui/joy";

export const themeJoy = extendTheme({
    colorSchemes: {
        light: {
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
                    "900": "#2b2b2b"  // très foncé
                },
                text: {
                    primary: "#707070",
                    secondary: "#fff",
                },
                background: {

                },
            },
        },
    },
    typography: {},
    components: {
    },
});
