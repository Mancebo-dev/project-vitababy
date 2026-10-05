import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 22,
        background: "#fbf9f5",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#af4d30",
        borderRadius: "8px",
        border: "2px solid #af4d30",
        fontWeight: 900,
        fontFamily: "serif",
      }}
    >
      V
    </div>,
    {
      ...size,
    },
  );
}
