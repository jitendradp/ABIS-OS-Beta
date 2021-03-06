import {ProfileType} from "../generated";

export type ProfileStatus =  "Offline" | "DoNotDisturb" | "Away" | "Available";

export type Profile = {
    id: string,

    createdBy: string,
    createdAt: string,

    updatedBy?: string,
    updatedAt?: string,

    name: string,

    timezone: string,

    profileType: ProfileType
    avatar: string
    status: ProfileStatus
    banner: string
    slogan: string
    jobTitle: string
};

export type ServiceStatus = "Running" | "Suspended" | "Failed" | "Succeeded";

export type Service = {
    id: string,

    createdBy: string,
    createdAt: string,

    updatedBy?: string,
    updatedAt?: string,

    name: string,

    timezone: string,

    status: ServiceStatus
    description: string
};
