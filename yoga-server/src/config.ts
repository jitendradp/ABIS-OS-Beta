export const config = {
    env: {
        systemId: "ce4b2352-7333-4820-9415-35a97b554d49",
        domain: "prisma",
        systemUser: "system@ce4b2352-7333-4820-9415-35a97b554d49.abis",
        anonymousUser: "anonymous@ce4b2352-7333-4820-9415-35a97b554d49.abis",
        signupAgentName: "SignupService"
    },
    auth: {
        sessionTimeout: 1000 * 60 * 60 * 24, // one day session timeout
        tokenLength: 64,                     // The length of the auth- and csrf-tokens in characters.
        bcryptRounds: 15,                    // The bcrypt salt round count
        normalizedResponseTime: 500          // Some methods like "signup" and "login" will delay the response to at least this configured time in ms.
    },
    mailer: {
        smtpSender: process.env.smtpSender,
        smtpUser: process.env.smtpUser,
        smtpPassword: process.env.smtpPassword,
        smtpServer: process.env.smtpServer
    }
};