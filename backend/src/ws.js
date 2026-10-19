import { WebSocketServer } from 'ws';

// Khung WebSocket / Signaling. Giao thức đầy đủ: Docs/[S-Call] asyncapi.yaml
//   - Khuôn dạng bản tin: { "type": "...", "requestId": "...", "data": { ... } }
//   - Kết nối:  wss://<host>/ws?ticket=<ticket>   (ticket lấy từ POST /api/v1/auth/ws-ticket)
//   - Heartbeat: client gửi `ping` mỗi 25s, server đóng kết nối nếu 60s không nhận frame (mã 4003)

export const CLOSE = {
  UNAUTHENTICATED: 4001,
  SESSION_TERMINATED: 4002,
  HEARTBEAT_TIMEOUT: 4003,
  FLOOD: 4004,
  BAD_FRAME: 4009,
};

const HEARTBEAT_TIMEOUT_MS = 60_000;
const MAX_FRAME_BYTES = 64 * 1024;

/** Người dùng -> tập các kết nối đang mở (một user có thể mở nhiều tab). */
export const connections = new Map();

export function sendTo(userId, type, data) {
  const frame = JSON.stringify({ type, data });
  for (const ws of connections.get(userId) ?? []) {
    if (ws.readyState === ws.OPEN) ws.send(frame);
  }
}

export function attachWebSocket(server) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_FRAME_BYTES });

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname !== '/ws') {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.ticket = url.searchParams.get('ticket');
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', (ws) => {
    

    if (!ws.ticket) {
      ws.close(CLOSE.UNAUTHENTICATED, 'Thiếu ticket');
      return;
    }

    let timer;
    const armHeartbeat = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ws.close(CLOSE.HEARTBEAT_TIMEOUT, 'Quá hạn heartbeat'), HEARTBEAT_TIMEOUT_MS);
    };
    armHeartbeat();

    const reply = (type, requestId, data) =>
      ws.send(JSON.stringify({ type, ...(requestId ? { requestId } : {}), ...(data ? { data } : {}) }));

    ws.on('message', (raw) => {
      armHeartbeat();
      let msg;
      try {
        msg = JSON.parse(raw.toString());
        if (typeof msg?.type !== 'string') throw new Error('thiếu type');
      } catch {
        ws.close(CLOSE.BAD_FRAME, 'Frame sai định dạng');
        return;
      }

      switch (msg.type) {
        case 'ping':
          reply('pong', msg.requestId, { serverTime: new Date().toISOString() });
          break;

        
        default:
          reply('error', msg.requestId, { code: 'UNKNOWN_EVENT', message: `Sự kiện chưa hỗ trợ: ${msg.type}` });
      }
    });

    ws.on('close', () => clearTimeout(timer));
    ws.on('error', (err) => console.error('[ws] lỗi:', err.message));
  });

  return wss;
}