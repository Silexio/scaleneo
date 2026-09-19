import { createMcpHandler } from "agents/mcp/server";
import { createServer } from "./server";

const handler = createMcpHandler(createServer, {
  allowedOriginHostnames: "*",
  corsOptions: { origin: "*" },
});

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    return handler(request, env, ctx);
  },
};
