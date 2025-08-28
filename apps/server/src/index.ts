import "dotenv/config";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "./routers";
import { createContext } from "./lib/context";
import { auth } from "./lib/auth";

const handler = new RPCHandler(appRouter);

const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "",
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.all("/api/auth/*", async (context) => {
		const { request } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}
		context.error(405);
	})
	.all("/rpc*", async (context) => {
		const { response } = await handler.handle(context.request, {
			prefix: "/rpc",
			context: await createContext({ context }),
		});
		return response ?? new Response("Not Found", { status: 404 });
	})
	.get("/", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});
