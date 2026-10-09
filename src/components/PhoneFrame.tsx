import { Img } from "remotion";
import { colors } from "../brand/theme";

// Shows an app screenshot inside a simple phone shape. src = staticFile("screenshots/...").
export const PhoneFrame: React.FC<{ src?: string; width?: number }> = ({ src, width = 640 }) => {
  const height = width * 2.16;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.12,
        padding: width * 0.03,
        background: "#000",
        boxShadow: `0 40px 120px ${colors.primary}55`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: width * 0.1,
          overflow: "hidden",
          background: colors.bgAlt,
        }}
      >
        {src ? <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
      </div>
    </div>
  );
};
