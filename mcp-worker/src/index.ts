import { createMcpHandler } from "agents/mcp/server";
import { createServer } from "./server";

const handler = {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    return createMcpHandler(createServer)(request, env, ctx);
  },
};

export default handler;
