import { HistoryType } from '../components/atoms/Row';
import { Page } from '../interface.global';
import { DirectoryType } from '../Page/Course/interface.directory';

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

export function getHistoryType(currentPage: string): HistoryType {
    switch (currentPage) {
        case Page.Courses:
            return HistoryType.Course;
        case Page.Chapters:
            return HistoryType.Chapter;
        case Page.Sections:
            return HistoryType.Section;
        default:
            return HistoryType.Course;
    }
}

export function getDirectoryType(currentPage: string): DirectoryType {
    switch (currentPage) {
        case Page.Courses:
            return DirectoryType.Course;
        case Page.Chapters:
            return DirectoryType.Chapter;
        case Page.Sections:
            return DirectoryType.Section;
        default:
            return DirectoryType.Course;
    }
}