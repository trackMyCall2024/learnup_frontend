import { extendTheme } from '@mui/joy';

interface ColorOptions {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
}

interface White {
    light: string;
    main: string;
    dark: string;
}

declare module '@mui/joy/styles' {
    interface Palette {
        grey?: ColorOptions;
        white?: White;
    }

    interface PaletteOptions {
        grey?: ColorOptions;
        white?: White;
    }
}

export const themeJoy = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    '50': '#f7f7f7',
                    '100': '#ededed',
                    '200': '#e3e3e3',
                    '300': '#d9d9d9',
                    '400': '#d6d6d6',
                    '500': '#D4D4D4',
                    '600': '#919190',
                    '700': '#7e7e7e',
                    '800': '#535353',
                    '900': '#2b2b2b',
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
                background: {
                    body: '#111111',
                    surface: '#FEFEFE',
                },
                grey: {
                    '50': '#FAFAFA',
                    '100': '#F5F5F5',
                    '200': '#EFEFEF',
                    '300': '#CCCCCC', // ← ton gris clair
                    '400': '#AAAAAA', // ← ton gris moyen
                    '500': '#888888',
                    '600': '#535353',
                    '700': '#272727', // ← ton gris foncé
                    '800': '#1f1f1f',
                    '900': '#1B1C1C', // ← ton gris très foncé
                },
            },
        },
    },
    components: {
        JoyInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    border: `1px solid ${theme.palette.primary[500]}`,
                    color: theme.palette.primary[500],
                    borderRadius: 10,
                    padding: '5px 20px',
                    boxShadow: 'none',
                }),
                input: ({ theme }) => ({
                    color: theme.palette.text.primary,
                    '&::placeholder': {
                        color: theme.palette.primary[600],
                    },
                }),
                startDecorator: ({ theme }) => ({
                    color: theme.palette.primary[500],
                }),
                endDecorator: ({ theme }) => ({
                    color: theme.palette.primary[500],
                }),
            },
        },
        JoyTextarea: {
            styleOverrides: {
                root: {
                    textAlign: 'justify',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '&:focus': {
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '&.Mui-focused': {
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
                textarea: {
                    textAlign: 'justify',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '&:focus': {
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '&:focus-within': {
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
    },
});
