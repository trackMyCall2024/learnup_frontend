import { Page } from "../../interface.global";

export enum DirectoryType {
    Course = "Course",
    Chapter = "Chapter",
    Section = "Section",
}

export interface Row {
    _id: string;
    parentID: string;
    name: string;
    logo: string | undefined;
    type: DirectoryType;
}
