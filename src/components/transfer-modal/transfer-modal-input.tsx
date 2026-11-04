export default function TransferModalInput({
  type = "text",
  fieldLabel,
  fieldId,
  value,
  onBlur,
  onChange,
  error,
  placeholder,
  characterLimit,
}: {
  type?: "text" | "number";
  fieldLabel: string;
  fieldId: string;
  value: string | number;
  onBlur: () => void;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  characterLimit?: number;
}) {
  return (
    <div className="transfer-modal-input">
      <div className="transfer-modal-input-header">
        <label htmlFor={fieldId}>{fieldLabel}</label>
        {characterLimit && (
          <span>
            {value.toString().length}/{characterLimit}
          </span>
        )}
      </div>
      <input
        id={fieldId}
        type={type}
        value={value}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && (
        <span id={`${fieldId}-error`} className="transfer-modal-field-error">
          {error}
        </span>
      )}
    </div>
  );
}
