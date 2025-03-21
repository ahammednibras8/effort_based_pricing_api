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

fastify.get("/price/:userId", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { userId } = request.params as { userId: string };

        const { data: effortLogs, error } = await supabase
            .from("effort_logs")
            .select("effortPoints")
            .eq("userId", userId);

        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }

        const totalEffortPoints = effortLogs?.reduce((sum, log) => sum + (log.effortPoints || 0), 0) || 0;

        let price = 30; //Base Price

        if (totalEffortPoints >= 100) {
            price = 22.5; //-25%
        } else if (totalEffortPoints >= 50) {
            price = 27; //-10%
        } else if (totalEffortPoints < 10) {
            price = 36;
        }

        reply.send({ price });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Internal Server Error" });
    }
});

fastify.get("/total-effort/:userId", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { userId } = request.params as { userId: string };

        const { data: effortLogs, error } = await supabase
            .from("effort_logs")
            .select("effortPoints")
            .eq("userId", userId);

        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }

        const totalEffortPoints = effortLogs?.reduce((sum, log) => sum + (log.effortPoints || 0), 0) || 0;

        reply.send({ totalEffortPoints });
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