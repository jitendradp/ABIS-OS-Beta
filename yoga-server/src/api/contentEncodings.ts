import {ContentEncodingCreateInput} from "../generated";

export class ContentEncodings {
    public static Signup : ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "Signup",
        type: "JsonSchema",
        data: JSON.stringify({
            Signup: {
                type: "object",
                properties: {
                    "first_name": {"type": "string"},
                    "last_name": {"type": "string"},
                    "email": {"type": "string"},
                    "password": {"type": "string"},
                    "passwordConfirmation": {"type": "string"}
                },
                required: [
                    "first_name",
                    "last_name",
                    "email",
                    "password",
                    "passwordConfirmation"
                ]
            }
        })
    };

    public static VerifyEmail : ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "VerifyEmail",
        type: "JsonSchema",
        data: JSON.stringify({
            VerifyEmail: {
                type: "object",
                properties: {
                    "code": {"type": "string"}
                },
                required: [
                    "code"
                ]
            }
        })
    };

    public static Login : ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "Login",
        type: "JsonSchema",
        data: JSON.stringify({
            Login: {
                type: "object",
                properties: {
                    "email": {"type": "string"},
                    "password": {"type": "string"}
                },
                required: [
                    "email",
                    "password"
                ]
            }
        })
    };
}
