import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

interface Purple {
    main: string;
}

interface White {
    light: string;
    main: string;
    dark: string;
}

declare module '@mui/material/styles' {
    interface Palette {
        purple: Purple;
        white: White;
    }

    interface PaletteOptions {
        purple?: Purple;
        white?: White;
    }
}

export let themeMui = createTheme({
    palette: {
        primary: {
            '50': '#f7f7f7', // très clair
            '100': '#ededed',
            '200': '#e3e3e3',
            '300': '#d9d9d9',
            '400': '#d6d6d6',
            '500': '#D4D4D4', // base
            '600': '#a9a9a9',
            '700': '#7e7e7e',
            '800': '#535353',
            '900': '#2b2b2b',
            light: '#f7f7f7',
            main: '#D4D4D4',
        },
        white: {
            light: '#FFFFFF',
            main: '#FEFEFE',
            dark: '#EAEAEA',
        },
        text: {
            primary: '#111111',
            secondary: '#111111',
        },
        warning: {
            main: "#F59C0C",
            contrastText: "#FEFEFE",
        },
        error: {
            light: "#E64B4B",
            main: "#AE0000",
            contrastText: "#FEFEFE",
        },
        grey: {
            '50': '#FAFAFA',
            '100': '#F5F5F5',
            '200': '#EFEFEF',
            '300': '#CCCCCC', // ← ton gris clair
            '400': '#AAAAAA', // ← ton gris moyen
            '500': '#888888',
            '600': '#919190',
            '700': '#272727', // ← ton gris foncé
            '800': '#1f1f1f',
            '900': '#1B1C1C', // ← ton gris très foncé
        },
        info: {
            main: '#111111',
            contrastText: '#FEFEFE',
        },
        purple: {
            main: '#CED7FF',
        },
        background: {
            default: '#111111',
            paper: '#FEFEFE',
        },
    },
    typography: {
        body1: {
            fontSize: '14px',
            color: '#111111',
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {},
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
        },
        MuiAccordion: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 2,
                }),
            },
        },
    },
});
