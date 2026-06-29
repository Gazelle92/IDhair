import { PatchEvent, set } from "sanity";

const displayTypes = [
  {
    value: "type-a",
    label: "type-a",
    description: "9 / 16",
    box: { width: 34, height: 60 },
  },
  {
    value: "type-b",
    label: "type-b",
    description: "16 / 9",
    box: { width: 72, height: 40 },
  },
];

function DisplayTypeInput({ value, onChange }) {
  const currentValue = value || "type-a";

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {displayTypes.map((type) => {
        const isSelected = currentValue === type.value;

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(PatchEvent.from(set(type.value)))}
            style={{
              alignItems: "center",
              background: isSelected ? "#eef3ff" : "#fff",
              border: `1px solid ${isSelected ? "#3f6df6" : "#d8dde6"}`,
              borderRadius: 6,
              color: "#111827",
              cursor: "pointer",
              display: "flex",
              gap: 12,
              justifyContent: "space-between",
              padding: "10px 12px",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ display: "grid", gap: 3 }}>
              <strong style={{ fontSize: 14 }}>{type.label}</strong>
              <span style={{ color: "#5f6b7a", fontSize: 12 }}>{type.description}</span>
            </span>
            <span
              aria-hidden="true"
              style={{
                alignItems: "center",
                display: "flex",
                height: 64,
                justifyContent: "center",
                width: 80,
              }}
            >
              <span
                style={{
                  background: isSelected ? "#3f6df6" : "#9aa5b5",
                  borderRadius: 3,
                  display: "block",
                  height: type.box.height,
                  width: type.box.width,
                }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default DisplayTypeInput;
