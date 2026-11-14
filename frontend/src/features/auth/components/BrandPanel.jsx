import { useState } from 'react';
import { Link } from 'react-router';

export default function BrandPanel({ t }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return <aside className="login-brand-panel">
    <Link to="/" aria-label={t('S-Call — Trang chủ')} className="login-brand-logo"><img src="/favicon.svg" alt="" />S-Call</Link>
    <div className="login-brand-content">
      <h1 className="login-brand-title">{t('Nơi dành cho những cuộc trò chuyện')} <span>{t('có ý nghĩa.')}</span></h1>
      <img src="/images/auth-connections.png" alt="" className={`login-brand-image ${imageLoaded ? 'auth-image-enter' : ''}`} onLoad={() => setImageLoaded(true)} width="1254" height="1254" />
    </div>
  </aside>;
}
