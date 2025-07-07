import { useEffect, useRef } from "react";
import { startBouncyLettersGame } from "../game/BouncyLettersGame";
import "../App.css"; // Make sure your monkey-dance CSS is included

export default function BouncyLetters() {
  const monkeyRef = useRef();

  useEffect(() => {
    startBouncyLettersGame("phaser-container", "neutral", () => {
      if (monkeyRef.current) {
        monkeyRef.current.classList.add("monkey-dance");
        setTimeout(() => monkeyRef.current.classList.remove("monkey-dance"), 600);
      }
    });
  }, []);

  return (
    <div
      id="bouncy-container"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundImage: "url('/assets/backgrounds/bg_happy.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Comic Sans MS', cursive",
      }}
    >
      {/* Owl (top-left) */}
      <img
        src="/assets/animals/owl.png"
        alt="owl"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "250px",
          height: "250px",
          zIndex: 1,
        }}
      />

      {/* Monkey (bottom-left) */}
      <img
        ref={monkeyRef}
        src="/assets/animals/monkey.png"
        alt="monkey"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          width: "250px",
          height: "250px",
          zIndex: 1,
        }}
      />

      {/* Turtle (bottom-right) */}
      <img
        src="/assets/animals/turtle.png"
        alt="turtle"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "250px",
          height: "250px",
          zIndex: 1,
        }}
      />

      {/* Phaser Game Container */}
      <div
        id="phaser-container"
        style={{
          width: "600px",
          height: "400px",
          backgroundColor: "#FFF3B0",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 0 25px rgba(0, 128, 0, 0.6)",
          border: "6px solid #3cb371",
          zIndex: 2,
        }}
      />
    </div>
  );
}
