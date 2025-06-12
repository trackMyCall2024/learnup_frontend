export enum Task {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    RELAUNCH = "relaunch",
    SUCCESS = "success",
    DECLINED = "declined",
}

export interface Client {
    _id?: string;
    name: string;
    nickname?: string;
    phoneNumber: number;
    availability?: boolean;
    rate?: number;
    photo?: string;
    website?: string;
    activity: string;
    regularOpeningHours?: {
        availability?: boolean;
        hourly: HourlyInterface[];
        periods: {
            open: {
                day: number;
                hour: number;
                minute: number;
            };
            close: {
                day: number;
                hour: number;
                minute: number;
            };
        }[];
    };
    location: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
        adress: string;
    };
    state?: Task;
    addedDate?: string | Date;
    plannedDate?: string | Date;
    user?: string;
    category?: string;
}

export interface HourlyInterface {
    day: string;
    houres: string;
}

export interface LocationLocalStorage {
    city: string;
    country: string;
}

export interface Column {
    id: string;
    label: string;
    minWidth?: number;
}

export enum OpenModal {
    UPDATE = "user",
    SEE = "add",
}

export enum UserModalAction {
    POST = "post",
    PUT = "put",
}

export interface UserModalActionPayload {
    isMultiple: boolean;
    data: Client[];
    action: UserModalAction;
}

export type HandleOpen = (
    modalOpen: OpenModal,
    modalOption: {
        isMultiple?: boolean;
        customStep?: number;
        client?: Client;
    },
) => void;