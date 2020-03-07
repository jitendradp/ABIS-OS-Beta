import {ContentEncodingCreateInput} from "./generated/prisma_client";

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

    /**
     * Describes a possible answer of a service that tells the client to
     * prominently display the "summary" and to reveal the "detail" on user-request.
     */
    public static Error : ContentEncodingCreateInput = {
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

    /**
     * Describes a possible answer of a service that tells the client to
     * take the 'context' and go to the next service ('toAgentId').
     */
    public static Continuation : ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "Continuation",
        type: "JsonSchema",
        data: JSON.stringify({
            Continuation: {
                type: "object",
                properties: {
                    "fromAgentId": {"type": "string"},
                    "toAgentId": {"type": "string"},
                    "context": {"type": "object"}
                },
                required: [
                    "fromAgentId",
                    "toAgentId"
                ]
            }
        })
    };
}
