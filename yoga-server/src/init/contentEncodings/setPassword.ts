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
                "code": {"type": "string"},
                "password": {"type": "string"},
                "password_confirmation": {"type": "string"}
            },
            "required": [
                "code",
                "password",
                "password_confirmation"
            ]
        }
    })
};