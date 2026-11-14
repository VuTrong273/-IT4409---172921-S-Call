import LanguageSelect from '../../../components/LanguageSelect.jsx';

export default function AuthFooter({ language, setLanguage, t }) {
  return <footer className="auth-footer">
    <div className="auth-footer-inner">
      <span>© 2026 S-Call</span>
      <LanguageSelect value={language} onChange={setLanguage} label={t('Ngôn ngữ')} />
    </div>
  </footer>;
}
