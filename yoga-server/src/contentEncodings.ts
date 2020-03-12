import {ContentEncodingCreateInput} from "./generated/prisma_client";

export class ContentEncodings {
    public static Signup: ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "Signup",
        type: "JsonSchema",
        data: JSON.stringify({
            Signup: {
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
                    "password_confirmation": {
                        "type": "string",
                        "minLength": 8
                    }
                },
                required: [
                    "first_name",
                    "last_name",
                    "email",
                    "password",
                    "password_confirmation"
                ]
            }
        })
    };

    public static VerifyEmail: ContentEncodingCreateInput = {
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

    public static Login: ContentEncodingCreateInput = {
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
    public static Error: ContentEncodingCreateInput = {
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
    public static Continuation: ContentEncodingCreateInput = {
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

    public static GeoJsonFeature: ContentEncodingCreateInput = {
        createdBy: "",
        maintainer: "",
        charset: "utf-8",
        name: "GeoJsonFeature",
        type: "JsonSchema",
        data: JSON.stringify({
            "GeoJSONFeature": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "https://geojson.org/schema/Feature.json",
                "title": "GeoJSON Feature",
                "type": "object",
                "required": [
                    "type",
                    "properties",
                    "geometry"
                ],
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "Feature"
                        ]
                    },
                    "properties": {
                        "oneOf": [
                            {
                                "type": "null"
                            },
                            {
                                "type": "object"
                            }
                        ]
                    },
                    "geometry": {
                        "oneOf": [
                            {
                                "type": "null"
                            },
                            {
                                "title": "GeoJSON Point",
                                "type": "object",
                                "required": [
                                    "type",
                                    "coordinates"
                                ],
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "Point"
                                        ]
                                    },
                                    "coordinates": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "number"
                                        }
                                    },
                                    "bbox": {
                                        "type": "array",
                                        "minItems": 4,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                }
                            },
                            {
                                "title": "GeoJSON LineString",
                                "type": "object",
                                "required": [
                                    "type",
                                    "coordinates"
                                ],
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "LineString"
                                        ]
                                    },
                                    "coordinates": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "array",
                                            "minItems": 2,
                                            "items": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "bbox": {
                                        "type": "array",
                                        "minItems": 4,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                }
                            },
                            {
                                "title": "GeoJSON Polygon",
                                "type": "object",
                                "required": [
                                    "type",
                                    "coordinates"
                                ],
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "Polygon"
                                        ]
                                    },
                                    "coordinates": {
                                        "type": "array",
                                        "items": {
                                            "type": "array",
                                            "minItems": 4,
                                            "items": {
                                                "type": "array",
                                                "minItems": 2,
                                                "items": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    },
                                    "bbox": {
                                        "type": "array",
                                        "minItems": 4,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                }
                            },
                            {
                                "title": "GeoJSON MultiPoint",
                                "type": "object",
                                "required": [
                                    "type",
                                    "coordinates"
                                ],
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "MultiPoint"
                                        ]
                                    },
                                    "coordinates": {
                                        "type": "array",
                                        "items": {
                                            "type": "array",
                                            "minItems": 2,
                                            "items": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "bbox": {
                                        "type": "array",
                                        "minItems": 4,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                }
                            },
                            {
                                "title": "GeoJSON MultiLineString",
                                "type": "object",
                                "required": [
                                    "type",
                                    "coordinates"
                                ],
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "MultiLineString"
                                        ]
                                    },
                                    "coordinates": {
                                        "type": "array",
                                        "items": {
                                            "type": "array",
                                            "minItems": 2,
                                            "items": {
                                                "type": "array",
                                                "minItems": 2,
                                                "items": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    },
                                    "bbox": {
                                        "type": "array",
                                        "minItems": 4,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                }
                            },
                            {
                                "title": "GeoJSON MultiPolygon",
                                "type": "object",
                                "required": [
                                    "type",
                                    "coordinates"
                                ],
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "MultiPolygon"
                                        ]
                                    },
                                    "coordinates": {
                                        "type": "array",
                                        "items": {
                                            "type": "array",
                                            "items": {
                                                "type": "array",
                                                "minItems": 4,
                                                "items": {
                                                    "type": "array",
                                                    "minItems": 2,
                                                    "items": {
                                                        "type": "number"
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "bbox": {
                                        "type": "array",
                                        "minItems": 4,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                }
                            },
                            {
                                "title": "GeoJSON GeometryCollection",
                                "type": "object",
                                "required": [
                                    "type",
                                    "geometries"
                                ],
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "GeometryCollection"
                                        ]
                                    },
                                    "geometries": {
                                        "type": "array",
                                        "items": {
                                            "oneOf": [
                                                {
                                                    "title": "GeoJSON Point",
                                                    "type": "object",
                                                    "required": [
                                                        "type",
                                                        "coordinates"
                                                    ],
                                                    "properties": {
                                                        "type": {
                                                            "type": "string",
                                                            "enum": [
                                                                "Point"
                                                            ]
                                                        },
                                                        "coordinates": {
                                                            "type": "array",
                                                            "minItems": 2,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        },
                                                        "bbox": {
                                                            "type": "array",
                                                            "minItems": 4,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "title": "GeoJSON LineString",
                                                    "type": "object",
                                                    "required": [
                                                        "type",
                                                        "coordinates"
                                                    ],
                                                    "properties": {
                                                        "type": {
                                                            "type": "string",
                                                            "enum": [
                                                                "LineString"
                                                            ]
                                                        },
                                                        "coordinates": {
                                                            "type": "array",
                                                            "minItems": 2,
                                                            "items": {
                                                                "type": "array",
                                                                "minItems": 2,
                                                                "items": {
                                                                    "type": "number"
                                                                }
                                                            }
                                                        },
                                                        "bbox": {
                                                            "type": "array",
                                                            "minItems": 4,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "title": "GeoJSON Polygon",
                                                    "type": "object",
                                                    "required": [
                                                        "type",
                                                        "coordinates"
                                                    ],
                                                    "properties": {
                                                        "type": {
                                                            "type": "string",
                                                            "enum": [
                                                                "Polygon"
                                                            ]
                                                        },
                                                        "coordinates": {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "array",
                                                                "minItems": 4,
                                                                "items": {
                                                                    "type": "array",
                                                                    "minItems": 2,
                                                                    "items": {
                                                                        "type": "number"
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "bbox": {
                                                            "type": "array",
                                                            "minItems": 4,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "title": "GeoJSON MultiPoint",
                                                    "type": "object",
                                                    "required": [
                                                        "type",
                                                        "coordinates"
                                                    ],
                                                    "properties": {
                                                        "type": {
                                                            "type": "string",
                                                            "enum": [
                                                                "MultiPoint"
                                                            ]
                                                        },
                                                        "coordinates": {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "array",
                                                                "minItems": 2,
                                                                "items": {
                                                                    "type": "number"
                                                                }
                                                            }
                                                        },
                                                        "bbox": {
                                                            "type": "array",
                                                            "minItems": 4,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "title": "GeoJSON MultiLineString",
                                                    "type": "object",
                                                    "required": [
                                                        "type",
                                                        "coordinates"
                                                    ],
                                                    "properties": {
                                                        "type": {
                                                            "type": "string",
                                                            "enum": [
                                                                "MultiLineString"
                                                            ]
                                                        },
                                                        "coordinates": {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "array",
                                                                "minItems": 2,
                                                                "items": {
                                                                    "type": "array",
                                                                    "minItems": 2,
                                                                    "items": {
                                                                        "type": "number"
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "bbox": {
                                                            "type": "array",
                                                            "minItems": 4,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "title": "GeoJSON MultiPolygon",
                                                    "type": "object",
                                                    "required": [
                                                        "type",
                                                        "coordinates"
                                                    ],
                                                    "properties": {
                                                        "type": {
                                                            "type": "string",
                                                            "enum": [
                                                                "MultiPolygon"
                                                            ]
                                                        },
                                                        "coordinates": {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "array",
                                                                "items": {
                                                                    "type": "array",
                                                                    "minItems": 4,
                                                                    "items": {
                                                                        "type": "array",
                                                                        "minItems": 2,
                                                                        "items": {
                                                                            "type": "number"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "bbox": {
                                                            "type": "array",
                                                            "minItems": 4,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "bbox": {
                                        "type": "array",
                                        "minItems": 4,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    "bbox": {
                        "type": "array",
                        "minItems": 4,
                        "items": {
                            "type": "number"
                        }
                    }
                }
            }
        })
    };
}
