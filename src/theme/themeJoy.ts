import { extendTheme } from "@mui/joy";

export const themeJoy = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    "50": "#e4f5ef",
                    "100": "#bde4d6",
                    "200": "#91d2bb",
                    "300": "#65c0a0",
                    "400": "#43b189",
                    "500": "#247561",
                    "600": "#206851",
                    "700": "#1a5744",
                    "800": "#154637",
                    "900": "#0c2a21",
                },
                text: {
                    primary: "#707070",
                    secondary: "#fff",
                },
                background: {},
            },
        },
    },
    typography: {},
    components: {
    },
});
