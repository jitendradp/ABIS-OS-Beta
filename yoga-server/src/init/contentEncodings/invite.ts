import {ContentEncodingCreateInput} from "../../generated/prisma_client";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "Invite",
    type: "JsonSchema",
    data: JSON.stringify({
        Invite: {
            "type": "object",
            "properties": {
                "email_or_profile_name": { "type": "string", "minLength": 6 },
                "to": {
                    "type": "string",
                    "enum": [
                        "Room",
                        "Channel"
                    ]
                },
                "to_id": { "type" : "string" },
                "show_history": { "type" : "boolean" }
            },
            "required": [
                "email_or_profile_name",
                "to",
                "show_history"
            ]
        }
    })
};