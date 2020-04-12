import {ContentEncodingCreateInput} from "../../generated/prisma_client";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "CreateProfile",
    type: "JsonSchema",
    data: JSON.stringify({
        CreateProfile: {
            "type": "object",
            "properties": {
                "image": { "type": "string" },
                "type": {
                    "type": "string",
                    "enum": [
                        "Personal",
                        "Organization"
                    ]
                },
                "profile_name": { "type": "string" , "minLength": 2},
                "slogan": { "type": "string", "minLength": 3 },
                "tags": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "type": { "type": "string", "enum": [
                                    "#",
                                    "Phone",
                                    "Mobile phone",
                                    "Website",
                                    "LinkedIn",
                                    "Facebook",
                                    "Twitter",
                                    "Youtube"
                                ]},
                            "value": { "type": "string" }
                        },
                        "required": [ "type", "value" ]
                    }
                }
            },
            "required": [
                "type",
                "profile_name",
                "slogan"
            ]
        }
    })
};