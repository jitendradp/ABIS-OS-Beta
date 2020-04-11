import {ContentEncodingCreateInput} from "../../generated/prisma_client";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "CreateRoom",
    type: "JsonSchema",
    data: JSON.stringify({
        CreateRoom: {
            "type": "object",
            "properties": {
                "visibility": {
                    "type": "string",
                    "enum": [
                        "Public",
                        "Private"
                    ]
                },
                "name": {"type": "string"},
                "icon": {"type": "string"},
                "banner": {"type": "string"},
                "topic": {"type": "string"},
                "tags": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string",
                                "enum": [
                                    "#"
                                ]
                            },
                            "value": { "type": "string" }
                        },
                        "required": [ "type", "value" ]
                    }
                }
            },
            "required": [
                "name"
            ]
        }
    })
};