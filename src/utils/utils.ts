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

export const getController = (currentPage: string|undefined) => {
    const pageElement = pages.find(
        (page) => page.name.toLowerCase() === currentPage?.toLowerCase(),
    );
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

export function getPageName(currentPage: Page) {
    switch (currentPage) {
        case Page.Courses:
            return 'Course';
        case Page.Chapters:
            return 'Chapter';
        case Page.Sections:
            return 'Section';
    }
}

export function goToPrevious() {
    window.history.back();
}

export function goToNext() {
    window.history.forward();
}

export function getDirectoryByPage(page: string): DirectoryType {
    switch (page) {
        case Page.Courses.toLowerCase():
            return DirectoryType.Course;

        case Page.Chapters.toLowerCase():
            return DirectoryType.Chapter;

        case Page.Sections.toLowerCase():
            return DirectoryType.Section;

        default:
            return DirectoryType.Course;
    }
}

export const getCurrentPageFromURL = (pathname: string): Page => {
    const pathSegments = pathname.split('/').filter((segment) => segment !== '');
    if (pathSegments.length === 0) return Page.Dashboard;

    const firstSegment = pathSegments[0];
    switch (firstSegment) {
        case 'dashboard':
            return Page.Dashboard;
        case 'courses':
            return Page.Courses;
        case 'chapters':
            return Page.Chapters;
        case 'sections':
            return Page.Sections;
        case 'section':
            return Page.Section;
        case 'social':
            return Page.Social;
        case 'profile':
            return Page.Profile;
        case 'blocker':
            return Page.Blocker;
        case 'settings':
            return Page.Settings;
        default:
            return Page.Dashboard;
    }
};

export const getTmpId = () => {
    return Math.random().toString(36).substring(2, 15);
};