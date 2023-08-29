import React from "react";

const styles: {
  container: React.CSSProperties;
  image: React.CSSProperties;
  secondImage: React.CSSProperties;
} = {
  container: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
  },
  secondImage: {
    clipPath: "polygon(50% 0%, 100% 0, 100% 100%, 50% 100%)",
  },
};

const DoubledImage: React.FC<{ img1: string; img2: string }> = ({
  img1,
  img2,
}) => (
  <div style={styles.container}>
    <img src={img1} alt="First half" style={styles.image} />
    <img
      src={img2}
      alt="Second half"
      style={{ ...styles.image, ...styles.secondImage }}
    />
  </div>
);
export default DoubledImage;
