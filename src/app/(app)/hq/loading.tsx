import type { CSSProperties } from "react";

export default function HQLoading() {
  const shimmer: CSSProperties = {
    background: "linear-gradient(90deg, #f0f0f5 25%, #e8e8f0 50%, #f0f0f5 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s ease-in-out infinite",
    borderRadius: 8,
  };
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
      <div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...shimmer, height: 26, width: 170, marginBottom: 8 }} />
          <div style={{ ...shimmer, height: 13, width: 250, borderRadius: 6, opacity: 0.7 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 92, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ ...shimmer, height: 11, width: "60%", marginBottom: 10 }} />
              <div style={{ ...shimmer, height: 22, width: "40%" }} />
            </div>
          ))}
        </div>
        <div style={{ height: 220, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, marginBottom: 12, padding: "16px 18px" }}>
          <div style={{ ...shimmer, height: 13, width: 140, marginBottom: 16 }} />
          <div style={{ ...shimmer, height: 140, borderRadius: 10 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ height: 140, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ ...shimmer, height: 13, width: 120, marginBottom: 16 }} />
            <div style={{ ...shimmer, height: 80, borderRadius: 10 }} />
          </div>
          <div style={{ height: 140, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ ...shimmer, height: 13, width: 120, marginBottom: 16 }} />
            <div style={{ ...shimmer, height: 80, borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </>
  );
}
