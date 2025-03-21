import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const fastify: FastifyInstance = Fastify({
    logger: true,
});

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

fastify.post("/log-activity", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { userId, activityType, effortPoints, timestamp } = request.body as {
            userId: string;
            activityType: string;
            effortPoints: number;
            timestamp: string;
        };

        const { error } = await supabase.from("effort_logs").insert({
            userId,
            activityType,
            effortPoints,
            timestamp,
        });

        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }

        reply.send({ message: "Activity logged successfully" });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Internal Server Error" });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log(`Server listening at ${fastify.server.address()}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();