import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "ChangePassword",
    type: "JsonSchema",
    data: JSON.stringify({
        ChangePassword: {
            "type": "object",
            "properties": {
                "old_password": {"type": "string"},
                "password": {"type": "string"},
                "password_confirmation": {"type": "string"}
            },
            "required": [
                "old_password",
                "password",
                "password_confirmation"
            ]
        }
    })
};