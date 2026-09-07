// components/public/SectionHeading.tsx
interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeading({
  label,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <div
      className={center ? "text-center" : ""}
      style={{ marginBottom: "var(--space-12)" }}
    >
      <div
        className="section-label"
        style={center ? { justifyContent: "center" } : undefined}
      >
        {label}
      </div>
      <h2>{title}</h2>
      {description && (
        <p
          className="text-muted mt-4"
          style={{ maxWidth: "600px", margin: "var(--space-4) auto 0" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}