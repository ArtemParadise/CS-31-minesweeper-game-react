import React from "react";

export default function GameStatus({ status }) {
  if (status === "win") return <h3 style={{textAlign: "center"}}>Ви перемогли!</h3>;
  if (status === "lose") return <h3 style={{textAlign: "center"}}>Ви програли!</h3>;
  return null;
}
