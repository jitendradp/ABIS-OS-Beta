import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "Continuation",
    type: "JsonSchema",
    data: JSON.stringify({
        Continuation: {
            type: "object",
            properties: {
                "fromAgentId": {"type": "string"},
                "toAgentId": {"type": "string"},
                "context": {"type": "object"}
            },
            required: [
                "fromAgentId",
                "toAgentId"
            ]
        }
    })
};