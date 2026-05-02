import type { RequestHandler } from './$types';

type Msg = { name: string; text: string; time: string };

const clients = new Set<ReadableStreamDefaultController<string>>();
const history: Msg[] = [];

export const GET: RequestHandler = () => {
    let controller: ReadableStreamDefaultController<string>;

    const stream = new ReadableStream<string>({
        start(c) {
            controller = c;
            clients.add(controller);
            for (const msg of history) {
                controller.enqueue(`data: ${JSON.stringify(msg)}\n\n`);
            }
        },
        cancel() {
            clients.delete(controller);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};

export const POST: RequestHandler = async ({ request }) => {
    const msg: Msg = await request.json();
    history.push(msg);
    if (history.length > 100) history.shift();

    const data = `data: ${JSON.stringify(msg)}\n\n`;
    for (const client of clients) client.enqueue(data);

    return new Response(null, { status: 204 });
};