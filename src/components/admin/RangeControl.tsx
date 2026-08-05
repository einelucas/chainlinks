export default function RangeControl({
  label,
  valueLabel,
  min,
  max,
  step = 1,
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="editor-range-field">
      <div className="editor-range-heading">
        <span>{label}</span>
        <strong>{valueLabel}</strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
      />
      {(minLabel || maxLabel) && (
        <div className="editor-range-labels">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
