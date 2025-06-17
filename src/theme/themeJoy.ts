import { extendTheme } from '@mui/joy';

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
                    '600': '#a9a9a9',
                    '700': '#7e7e7e',
                    '800': '#535353',
                    '900': '#2b2b2b',
                },
                text: {
                    primary: '#111111',
                    secondary: '#111111',
                },
                background: {
                    body: '#111111',
                    surface: '#FEFEFE',
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
    },
});
