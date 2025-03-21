import Fastify, { FastifyInstance } from "fastify"

const fastify: FastifyInstance = Fastify({
    logger: true,
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