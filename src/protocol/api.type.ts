import { DirectoryType } from "../Page/Course/interface.directory";

export {};

export interface HistoryResponse {}

// Types de base pour les ObjectId MongoDB
export interface MongoDBObjectId {
    _id: string;
}

// Types pour les réponses API basés sur les schémas
export interface ResumeResponse extends MongoDBObjectId {
    section: string;
    data: string;
}

export interface NoteResponse extends MongoDBObjectId {
    section: string;
    data: string;
}

export interface PageResponse extends MongoDBObjectId {
    section: string;
}

export interface ChunkResponse extends MongoDBObjectId {
    section: string;
    page: string;
    index: number;
    data: string;
    embedding: number[];
}

export interface ChatResponse extends MongoDBObjectId {
    section: string;
    message: string;
    user: 'ia' | 'user';
}

export interface DirectoryResponse extends MongoDBObjectId {
    parentID: string;
    name: string;
    logo: string | undefined;
    type: DirectoryType;
}

export interface DirectoryRequest {
    parentID: string;
    name: string;
    logo: string | undefined;
    type: DirectoryType;
}