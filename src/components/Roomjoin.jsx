import { useRef ,useState } from "react"
import '../roomjoin.css'
const CARDS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const SUITS = ["♠","♥","♦","♣"];
 
const bgCardData = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${3 + (i * 6.2) % 92}%`,
  top: `${5 + (i * 11.3) % 85}%`,
  delay: `${(i * 1.3) % 8}s`,
  duration: `${5 + (i * 1.1) % 5}s`,
  rotStart: `${(i % 2 === 0 ? -1 : 1) * (3 + (i * 4) % 15)}deg`,
  rotEnd: `${(i % 2 === 0 ? 1 : -1) * (3 + (i * 4) % 15)}deg`,
  floatDist: `${(i % 2 === 0 ? -1 : 1) * (12 + (i * 3) % 20)}px`,
  label: `${CARDS[i % CARDS.length]}${SUITS[i % 4]}`,
}));
 
export default function RoomJoin({ setJoined }) {
  const roomRef = useRef();
  const [shaking, setShaking] = useState(false);
 
  function handleSubmit(e) {
    e.preventDefault();
    const roomId = roomRef.current.value;
    if (roomId.trim() !== "") {
      setJoined(roomId);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }
 
  return (
    <>
      <div className="room-join-wrapper">
 
        {/* Floating background cards */}
        <div className="bg-cards">
          {bgCardData.map(c => (
            <div
              key={c.id}
              className="bg-card"
              style={{
                left: c.left,
                top: c.top,
                animationDuration: c.duration,
                animationDelay: c.delay,
                "--rot-start": c.rotStart,
                "--rot-end": c.rotEnd,
                "--float-dist": c.floatDist,
              }}
            >
              {c.label}
            </div>
          ))}
        </div>
 
        {/* Main panel */}
        <div className="main-card">
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />
 
          <div className="card-symbol">🃏</div>
          <h1 className="game-title">Memory Duel</h1>
          <p className="game-subtitle">1 v 1 · Card Sequence · Live</p>
 
          <div className="divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>
 
          <div className="how-to-play">
            <p>
              Face off against a rival. Flip cards <strong>1 through 10</strong> in perfect order — faster than your opponent — to claim victory.
            </p>
          </div>
 
          <form onSubmit={handleSubmit}>
            <label className="input-label" htmlFor="roomId">Room ID</label>
            <div className="input-wrapper">
              <input
                id="roomId"
                className="room-input"
                type="text"
                placeholder="Enter your room code…"
                ref={roomRef}
                style={shaking ? { animation: "shake 0.4s ease" } : {}}
              />
            </div>
            <button className="join-btn" type="submit">
              Enter the Arena
            </button>
          </form>
 
          <div className="suits-row">
            {["♠","♥","♦","♣"].map(s => (
              <span key={s} className="suit">{s}</span>
            ))}
          </div>
        </div>
 
        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%,60% { transform: translateX(-6px); }
            40%,80% { transform: translateX(6px); }
          }
        `}</style>
      </div>
    </>
  );
}