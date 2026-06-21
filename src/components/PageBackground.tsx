import Image from "next/image";

type PageBackgroundProps = {
  blur?: boolean;
};

export function PageBackground({ blur = true }: PageBackgroundProps) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#1a1814",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: blur ? "-24px" : 0,
          filter: blur ? "blur(10px)" : undefined,
          transform: blur ? "scale(1.05)" : undefined,
        }}
      >
        <Image
          src="/images/bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: blur ? "rgba(0, 0, 0, 0.28)" : "rgba(255, 255, 255, 0.4)",
        }}
      />
    </div>
  );
}
