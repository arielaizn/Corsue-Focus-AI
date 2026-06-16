/**
 * A deterministic, SSR-safe QR-style mark (not a real scannable code — a
 * credible visual stand-in). Pattern is fixed from a seed string so it renders
 * identically on server and client. NOT hand-drawn.
 */
export function QRMark({ size = 64, className }: { size?: number; className?: string }) {
  const n = 11;
  // fixed bit pattern (deterministic) — looks like a QR without being random
  const seed =
    "11111110010101111111" +
    "10000010111010000001" +
    "10111010001010111010" +
    "10111010110010111010" +
    "10111010010110111010" +
    "10000010101010000010" +
    "11111110101011111110" +
    "00000000110100000000" +
    "11010111011010110101" +
    "00101000100101001010" +
    "11011101011100110110" +
    "00000000010110101001" +
    "11111110011010011011" +
    "10000010101011010010" +
    "10111010110100101101" +
    "10111010001011010110" +
    "10111010110101001011" +
    "10000010010110110100" +
    "11111110101011010110";
  const cells = Array.from({ length: n * n }, (_, i) => seed[i % seed.length] === "1");

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: `repeat(${n}, 1fr)`,
        gap: 1,
        padding: 4,
        borderRadius: 8,
        background: "oklch(0.97 0.012 250)",
      }}
      aria-hidden
    >
      {cells.map((on, i) => (
        <span
          key={i}
          style={{
            background: on ? "oklch(0.13 0.04 264)" : "transparent",
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

export default QRMark;
