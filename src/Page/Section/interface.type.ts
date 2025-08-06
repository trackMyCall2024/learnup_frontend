import { ChatResponse, MongoDBObjectId, NoteResponse, PageResponse, ResumeResponse } from "../../protocol/api.type";

export enum UserSection {
    Ia = 'ia',
    User = 'user',
}

export interface Page extends MongoDBObjectId {
    title: string;
    data: string;
}

export interface ChatMessage {
    user: UserSection;
    message: string;
}

export interface SectionProps {
    _id: string;
    parentId: string;
    name: string;
    chat: ChatResponse[];
    pages: Page[];
    resume: ResumeResponse;
    note: NoteResponse;
}

export enum View {
    Pages = 'pages',
    Resume = 'resume',
    Note = 'note',
}

export enum SelectedGame {
    Quiz = 'quiz',
    FlashCard = 'flashCard',
}