export enum UserSection {
    Ia = 'ia',
    User = 'user',
}

export interface Page {
    title: string;
    subtitle: string;
    data: string;
}

export interface Content {
    pages: Page[];
    resume: string;
    note: string;
}

export interface ChatMessage {
    user: UserSection;
    message: string;
}

export interface SectionProps {
    _id: string;
    name: string;
    chapter: string;
    content: Content;
    chat: ChatMessage[];
}

export interface SectionTexts {
    currentPage: Page;
    chat: ChatMessage[];
    resume: string;
    note: string;
}