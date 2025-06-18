import { Page } from '../interface.global';

export const getCapitalizeCase = (text?: string): string => {
    if (!text) {
        return '';
    }

    const firstLetter = text.charAt(0).toUpperCase();
    const rest = text.slice(1);

    return `${firstLetter}${rest}`;
};

export const getController = (currentPage: string) => {
    const pageElement = pages.find((page) => page.name.toLowerCase() === currentPage?.toLowerCase());
    return pageElement?.controller;
};

const pages = [
    {
        name: Page.Courses,
        controller: 'course',
    },
    {
        name: Page.Chapters,
        controller: 'chapter',
    },
    {
        name: Page.Sections,
        controller: 'section',
    },
];
