import { useEffect, useRef, useState } from 'react';
import useDeviceCheck from '../hooks/useDeviceCheck.js';

export default function CallSettings() {
  const check = useDeviceCheck();
  const [microphone, setMicrophone] = useState('');
  const [camera, setCamera] = useState('');
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = check.kind === 'video' ? check.stream : null;
    return () => { video.srcObject = null; };
  }, [check.stream, check.kind]);
  function selectDevice(kind, value) {
    check.stop();
    if (kind === 'audio') setMicrophone(value);
    else setCamera(value);
  }
  return <section className="settings-editor" aria-labelledby="call-devices-heading">
    <header><h2 id="call-devices-heading">Âm thanh và hình ảnh</h2><p>Kiểm tra thiết bị trước khi bắt đầu cuộc gọi.</p></header>
    <p className="settings-help">Trình duyệt chỉ xin quyền khi bạn bấm kiểm tra. Tên thiết bị sẽ hiển thị sau khi được cấp quyền. Lựa chọn thiết bị áp dụng cho lần kiểm tra này.</p>
    <div className="settings-preference-row"><div><h3 id="microphone-label">Microphone</h3><p>Nói thử để xem mức âm thanh đầu vào.</p></div><select className="settings-select" aria-labelledby="microphone-label" value={microphone} disabled={check.busy} onChange={(event) => selectDevice('audio', event.target.value)}><option value="">Mặc định của thiết bị</option>{check.devices.filter((device) => device.kind === 'audioinput' && device.deviceId).map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || `Microphone ${index + 1}`}</option>)}</select></div>
    <div className="settings-device-actions"><button type="button" className="settings-button settings-button-secondary" disabled={check.busy || !check.supported} onClick={() => check.kind === 'audio' ? check.stop() : check.start('audio', microphone)}>{check.kind === 'audio' ? 'Dừng kiểm tra mic' : 'Kiểm tra mic'}</button>{check.kind === 'audio' && <div className="settings-mic-level"><progress max="100" value={check.level} aria-label="Mức âm thanh microphone" /><span>Mic đang bật</span></div>}</div>
    <div className="settings-preference-row"><div><h3 id="camera-label">Camera</h3><p>Xem trước hình ảnh từ camera.</p></div><select className="settings-select" aria-labelledby="camera-label" value={camera} disabled={check.busy} onChange={(event) => selectDevice('video', event.target.value)}><option value="">Mặc định của thiết bị</option>{check.devices.filter((device) => device.kind === 'videoinput' && device.deviceId).map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${index + 1}`}</option>)}</select></div>
    <div className="settings-camera-preview"><video ref={videoRef} autoPlay muted playsInline aria-label="Hình ảnh kiểm tra camera" hidden={check.kind !== 'video'} />{check.kind !== 'video' && <p>Camera đang tắt</p>}</div>
    <div className="settings-device-actions"><button type="button" className="settings-button settings-button-secondary" disabled={check.busy || !check.supported} onClick={() => check.kind === 'video' ? check.stop() : check.start('video', camera)}>{check.kind === 'video' ? 'Tắt camera' : 'Kiểm tra camera'}</button>{check.busy && <><span role="status">Đang chờ thiết bị…</span><button type="button" className="settings-text-button" onClick={check.stop}>Hủy</button></>}</div>
    {!check.supported && <p className="settings-availability">Kiểm tra thiết bị cần trình duyệt hỗ trợ và kết nối HTTPS hoặc localhost.</p>}
    {check.error && <p className="settings-error" role="alert">{check.error}</p>}
    <p className="settings-help">Mic và camera tự tắt khi rời mục này hoặc chuyển sang tab khác. Không ghi âm, ghi hình hay gửi dữ liệu kiểm tra lên máy chủ.</p>
  </section>;
}
