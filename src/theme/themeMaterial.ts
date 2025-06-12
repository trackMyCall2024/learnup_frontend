import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";

interface TaskColor {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
}

interface TaskStatus {
    not_started: TaskColor;
    in_progress: TaskColor;
    relaunch: TaskColor;
    success: TaskColor;
    declined: TaskColor;
}

declare module "@mui/material/styles" {
    interface Palette {
        taskStatus: TaskStatus;
    }

    interface PaletteOptions {
        taskStatus?: TaskStatus;
    }
}

export let themeMui = createTheme({
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
            light: "#e4f5ef",
            main: "#247561",
        },
        text: {
            primary: "#4F4F4F",
            secondary: "#858b94",
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
            200: "#EBEBEB",
        },
        background: {
            default: "#fff",
            paper: "#fff",
        },
    },
    typography: {
        body1: {
            fontSize: "14px",
        },
    },
    components: {
    },
});
