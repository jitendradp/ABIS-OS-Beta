import {ContentEncodingCreateInput} from "../../generated/prisma_client";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "SetPassword",
    type: "JsonSchema",
    data: JSON.stringify({
        SetPassword: {
            "type": "object",
            "properties": {
                "password": {"type": "string"},
                "password_confirmation": {"type": "string"}
            },
            "required": [
                "password",
                "password_confirmation"
            ]
        }
    })
};