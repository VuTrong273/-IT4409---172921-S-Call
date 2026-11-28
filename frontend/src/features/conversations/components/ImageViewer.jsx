import { useEffect, useRef } from 'react';
export default function ImageViewer({ image, onClose }) {
  const ref = useRef(null);
  useEffect(() => { if (image && !ref.current.open) ref.current.showModal(); else if (!image && ref.current.open) ref.current.close(); }, [image]);
  return <dialog ref={ref} className="chat-image-viewer" onClose={onClose} onCancel={onClose} aria-label="Xem ảnh"><header><span>{image?.name}</span><button type="button" onClick={onClose} aria-label="Đóng ảnh">×</button></header>{image && <><img src={image.url} alt={image.name} /><a href={image.url} download={image.name}>Tải ảnh xuống</a></>}</dialog>;
}
