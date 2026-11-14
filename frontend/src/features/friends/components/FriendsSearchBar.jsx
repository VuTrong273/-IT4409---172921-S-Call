import { useId } from 'react';
import FriendIcon from './FriendIcon.jsx';

export default function FriendsSearchBar({ value, onChange, onClear, onSubmit, inputRef, discover = false, error = '' }) {
  const errorId = useId();
  return <>
    <form className="friends-search-form" role="search" aria-label={discover ? 'Tìm người dùng' : 'Tìm trong danh sách'} onSubmit={onSubmit}>
      <div className="friends-search-field">
        <FriendIcon name="search" />
        <input
          ref={inputRef}
          aria-label={discover ? 'Tên đăng nhập hoặc email' : 'Tìm theo tên hoặc tên đăng nhập'}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          placeholder={discover ? 'Tên đăng nhập hoặc email' : 'Tìm theo tên hoặc tên đăng nhập'}
          value={value} maxLength={100} autoCapitalize="none" spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="button" className={`friends-clear-search ${value ? '' : 'is-empty'}`} aria-label="Xóa tìm kiếm" aria-hidden={!value} tabIndex={value ? 0 : -1} disabled={!value} onClick={onClear}>×</button>
      </div>
    </form>
    {error && <p id={errorId} className="friends-search-hint is-error" role="alert">{error}</p>}
  </>;
}
