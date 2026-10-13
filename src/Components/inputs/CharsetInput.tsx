import { Input, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { invalidChars, MAX_TEXT_LENGTH, sanitize } from '../../model/charsets';

/** Text input restricted to a character set (the URL encodes text per character); commits on blur or Enter. */
export const CharsetInput: React.FC<{
  value: string;
  onCommit: (value: string) => void;
  charset: readonly string[];
  ariaLabel: string;
  placeholder?: string;
  validate?: (value: string) => string | null;
  className?: string;
}> = ({ value, onCommit, charset, ariaLabel, placeholder, validate, className }) => {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);
  useEffect(() => setDraft(value), [value]);

  const invalid = invalidChars(draft, charset);
  const error = invalid.length
    ? `Not allowed: ${invalid.map((c) => (c === ' ' ? '␣' : c)).join(' ')}`
    : (validate?.(draft) ?? null);

  const commit = () => {
    const next = sanitize(draft, charset);
    if (validate?.(next)) return setDraft(value);
    if (next !== value) onCommit(next);
    else setDraft(value);
  };

  return (
    <Tooltip title={error} open={focused && !!error} placement="bottom">
      <Input
        className={className}
        value={draft}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={!!error}
        maxLength={MAX_TEXT_LENGTH}
        status={error ? 'error' : undefined}
        variant="filled"
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => (setFocused(false), commit())}
        onPressEnter={commit}
        onKeyDown={(e) => e.key === 'Escape' && setDraft(value)}
      />
    </Tooltip>
  );
};
