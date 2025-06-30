export default function handler(request: Request): Response {
  if (request.method === "GET") {
    return Response.json({ message: "hi2" });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const config = {
  runtime: "edge",
};
