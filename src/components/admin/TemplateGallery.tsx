import { APPEARANCE_TEMPLATES, type TemplateTheme } from "@/lib/appearance-templates";
import { CheckIcon } from "./AdminIcons";

type Props = {
  current: TemplateTheme;
  onApply: (theme: TemplateTheme) => void;
};

function isActive(current: TemplateTheme, theme: TemplateTheme): boolean {
  return (Object.keys(theme) as (keyof TemplateTheme)[]).every(
    (key) => String(current[key]) === String(theme[key])
  );
}

function backgroundStyle(theme: TemplateTheme): string {
  if (theme.bgType === "gradient") {
    return `linear-gradient(${theme.bgGradientAngle}deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})`;
  }
  return theme.bgColor;
}

export default function TemplateGallery({ current, onApply }: Props) {
  return (
    <div className="template-grid">
      {APPEARANCE_TEMPLATES.map((template) => {
        const active = isActive(current, template.theme);

        return (
          <button
            type="button"
            key={template.id}
            className={`template-card ${active ? "is-active" : ""}`}
            onClick={() => onApply(template.theme)}
          >
            <span
              className="template-card-preview"
              style={{ background: backgroundStyle(template.theme) }}
            >
              <span
                className="template-card-preview-avatar"
                style={{ background: template.theme.accentColor }}
              />
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="template-card-preview-pill"
                  style={{
                    background: template.theme.buttonBgColor,
                    borderColor: template.theme.buttonBorderColor,
                    borderRadius: `${Math.min(template.theme.buttonRadius, 10)}px`,
                  }}
                />
              ))}
              {active && (
                <span className="template-card-badge">
                  <CheckIcon />
                </span>
              )}
            </span>

            <span className="template-card-body">
              <strong>{template.name}</strong>
              <small>{template.description}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
