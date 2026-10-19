import { api } from './api.js';

// Kết nối WebSocket theo Docs/[S-Call] asyncapi.yaml:
//   1) POST /auth/ws-ticket  -> ticket sống 60 giây, dùng một lần
//   2) mở wss://<host>/ws?ticket=<ticket>
// Mọi frame có dạng { type, requestId?, data }.

export async function openSocket(onEvent) {
  const { ticket } = await api('/auth/ws-ticket', { method: 'POST' });
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${proto}://${location.host}/ws?ticket=${encodeURIComponent(ticket)}`);

  ws.onmessage = (e) => onEvent(JSON.parse(e.data));
  // Heartbeat: gửi ping mỗi 25 giây
  const heartbeat = setInterval(() => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ type: 'ping' })), 25_000);
  ws.onclose = () => clearInterval(heartbeat);

  const send = (type, data, requestId = crypto.randomUUID()) => {
    ws.send(JSON.stringify({ type, requestId, data }));
    return requestId;
  };
  return { ws, send };
}
