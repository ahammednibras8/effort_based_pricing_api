import Fastify, { FastifyInstance } from "fastify"
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const fastify: FastifyInstance = Fastify({
    logger: true,
});

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

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