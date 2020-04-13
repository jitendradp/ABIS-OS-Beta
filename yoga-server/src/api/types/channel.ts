import {Agent} from "../../generated";

export type Channel = {
    id: string,
    owner: string,
    createdBy: string,
    createdAt: string,
    updatedBy?: string,
    updatedAt?: string,
    name: string,
    entryCount?: number,
    receiver: Agent,
    reverse?: Channel,
};