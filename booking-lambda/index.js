const { Client } = require("pg");

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432, // Default PostgreSQL port,
    ssl: { rejectUnauthorized: false }
};

// **Helper function to format Lex responses**
function formatLexResponse(state, message) {
    return {
        sessionState: {
            dialogAction: {
                type: "Close",
            },
            intent: {
                name: "BookHotel",
                state: state, // "Fulfilled" or "Failed"
            },
        },
        messages: [
            {
                contentType: "PlainText",
                content: message,
            },
        ],
    };
}

exports.handler = async (event) => {
    const intentName = event.interpretations?.[0]?.intent?.name;
    const slots = event.interpretations?.[0]?.intent?.slots;

    const client = new Client(dbConfig);
    await client.connect();

    try {
        if (intentName === "BookHotel") {
            // ✅ Correctly extract slot values
            const name = slots.name?.value?.interpretedValue || "Unknown";
            const date = slots.date?.value?.resolvedValues?.[0] || slots.date?.value?.interpretedValue || null;
            const time = slots.time?.value?.interpretedValue || null;
            const numPeople = slots.numPeople?.value?.interpretedValue || 1; // Default to 1 if missing

            if (!date || !time || !name) {
                return formatLexResponse(
                    "Failed",
                    "Invalid input. Please provide a valid name, date, and time."
                );
            }

            await client.query(
                "INSERT INTO bookings (name, date, time) VALUES ($1, $2, $3)",
                [name, date, time]
            );

            return formatLexResponse("Fulfilled", `Booking confirmed for ${name} on ${date} at ${time}.`);
        }

        return { messages: [{ contentType: "PlainText", content: "Invalid request." }] };
    } catch (error) {
        console.error("Database error:", error);
        return { messages: [{ contentType: "PlainText", content: "Error processing request." }] };
    } finally {
        await client.end();
    }
};
