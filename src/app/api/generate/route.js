export const runtime = "edge";

export async function GET() {
  return Response.json({
    body: {
      message: "Hello from the API!",
    },
  });
}

