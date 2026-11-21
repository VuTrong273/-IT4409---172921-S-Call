import { useEffect, useRef, useState } from 'react';

const errors = {
  NotAllowedError: 'Chưa được cấp quyền. Hãy cho phép truy cập thiết bị trong cài đặt của trình duyệt rồi thử lại.',
  NotFoundError: 'Không tìm thấy thiết bị phù hợp. Hãy kết nối mic hoặc camera rồi thử lại.',
  NotReadableError: 'Không mở được thiết bị. Thiết bị có thể đang được ứng dụng khác sử dụng.',
  OverconstrainedError: 'Thiết bị đã chọn không còn khả dụng. Hãy chọn thiết bị mặc định rồi thử lại.',
};

export default function useDeviceCheck() {
  const [devices, setDevices] = useState([]);
  const [stream, setStream] = useState(null);
  const [kind, setKind] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [level, setLevel] = useState(0);
  const resources = useRef({});
  const request = useRef(0);
  const supported = !!navigator.mediaDevices?.getUserMedia && window.isSecureContext;

  function release() {
    resources.current.stream?.getTracks().forEach((track) => track.stop());
    clearInterval(resources.current.timer);
    resources.current.context?.close().catch(() => {});
    resources.current = {};
  }
  function stop() {
    request.current += 1;
    release();
    setStream(null);
    setKind(null);
    setBusy(false);
    setLevel(0);
  }
  useEffect(() => {
    function onHidden() { if (document.hidden) stop(); }
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      request.current += 1;
      release();
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);

  async function start(nextKind, deviceId) {
    stop();
    setError('');
    if (!supported) { setError('Trình duyệt cần hỗ trợ camera/mic và sử dụng kết nối HTTPS hoặc localhost.'); return; }
    const token = request.current;
    setBusy(true);
    try {
      const constraint = deviceId ? { deviceId: { exact: deviceId } } : true;
      const media = await navigator.mediaDevices.getUserMedia({ audio: nextKind === 'audio' ? constraint : false, video: nextKind === 'video' ? constraint : false });
      if (token !== request.current) { media.getTracks().forEach((track) => track.stop()); return; }
      resources.current.stream = media;
      setStream(media);
      setKind(nextKind);
      if (nextKind === 'audio') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const context = new AudioContextClass();
          resources.current.context = context;
          const analyser = context.createAnalyser();
          analyser.fftSize = 256;
          context.createMediaStreamSource(media).connect(analyser);
          await context.resume();
          if (token !== request.current) return;
          const samples = new Uint8Array(analyser.fftSize);
          resources.current.timer = setInterval(() => {
            analyser.getByteTimeDomainData(samples);
            const rms = Math.sqrt(samples.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / samples.length);
            setLevel(Math.min(100, Math.round(rms * 350)));
          }, 100);
        }
      }
      try {
        const available = await navigator.mediaDevices.enumerateDevices();
        if (token === request.current) setDevices(available.filter((device) => ['audioinput', 'videoinput'].includes(device.kind)));
      } catch { /* Default devices still work if enumeration is restricted. */ }
    } catch (cause) {
      if (token === request.current) { release(); setStream(null); setKind(null); setError(errors[cause.name] || 'Không kiểm tra được thiết bị. Vui lòng thử lại.'); }
    } finally {
      if (token === request.current) setBusy(false);
    }
  }
  return { devices, stream, kind, busy, error, level, supported, start, stop };
}
