import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "Signup",
    type: "JsonSchema",
    data: JSON.stringify({
        Signup: {
            "type": "object",
            "properties": {
                "first_name": {"type": "string", "minLength": 2},
                "last_name": {"type": "string", "minLength": 3},
                "email": {"type": "string", "minLength": 6},
                "password": {"type": "string", "minLength": 8},
                "password_confirmation": {"type": "string", "minLength": 8}
            },
            "required": [
                "first_name",
                "last_name",
                "email",
                "password",
                "password_confirmation"
            ]
        }
    })
};