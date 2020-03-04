import {ContentEncodingCreateInput} from "../generated/prisma_client";

export class ContentEncodings {
    public static Signup : ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "Signup",
        type: "JsonSchema",
        data: JSON.stringify({
            Signup:{
                type: "object",
                properties: {
                    "first_name": {
                        "type": "string",
                        "minLength": 3

                    },
                    "last_name": {
                        "type": "string",
                        "minLength": 3
                    },
                    "email": {
                        "type": "string",
                        "minLength": 6
                    },
                    "password": {
                        "type": "string",
                        "minLength": 8
                    },
                    "passwordConfirmation": {
                        "type": "string",
                        "minLength": 8
                    }
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

    public static ValidationError : ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "ValidationError",
        type: "Custom",
        data: null
    };

    public static Continuation : ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "Continuation",
        type: "Custom",
        data: null
    };
}
