import {ContentEncodingCreateInput} from "../../generated/prisma_client";

export const ContentEncoding: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "Error",
    type: "JsonSchema",
    data: JSON.stringify({
        Error: {
            type: "object",
            properties: {
                summary: {
                    type: "string"
                },
                detail: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            "key": "string",
                            "value": "string"
                        },
                        required: [
                            "key",
                            "value"
                        ]
                    }
                }
            },
            required: [
                "summary"
            ]
        }
    })
};