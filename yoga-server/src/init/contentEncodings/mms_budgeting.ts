import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "dave",
    maintainer: "munichMotosport",
    charset: "utf-8",
    name: "CashPosition",
    type: "JsonSchema",
    data: JSON.stringify({
        Budgeting: {
            "type": "object",
            "properties": {
                "approved_correctly": {"type": "string"},
                "budget_line": {"type": "string"},
                "cost_line": {"type": "string"},
                "finance_group": {
                    "type": "string",
                    "enum": ["Globalbudget", "Studienzuschüsse", "Drittmittel", "Ausbauplanung", "Sonstiges"]
                },
                "budgeting_date": {"type": "string"}
            },
            "required": [
                "approved_correctly",
                "budget_line",
                "cost_line",
                "business_reason",
                "finance_group"
            ]
        },
        Layout: [
            {"type": "flex", "flex-flow": "row wrap", "items": ["budget_line", "cost_line"]},
            {"type": "div", "display": "flex", "flex-direction": "row",
                "items": [
                    {
                        "key": "approved_correctly",
                        "flex": "1 1 150px",
                        "notitle": true,
                        "placeholder": "Approved correctly by"
                    },
                    {"key": "finance_group", "flex": "1 1 150px", "notitle": true, "placeholder": "Financing"}
                ]
            },
            {"key": "budgeting_date", "type": "date"}
        ]

    }),

};