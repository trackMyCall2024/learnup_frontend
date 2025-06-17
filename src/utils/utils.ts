export const getCapitalizeCase = (text?: string): string => {
    if (!text) {
        return '';
    }

    const firstLetter = text.charAt(0).toUpperCase();
    const rest = text.slice(1);

    return `${firstLetter}${rest}`;
};
