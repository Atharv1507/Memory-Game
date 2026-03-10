import { useState, useEffect, useRef } from "react";
import "./App.css";
import Card from "./components/Card";
import RoomJoin from "./components/Roomjoin";

function App() {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [turn, setTurn] = useState(true);
  const [myPlayerId, setMyPlayerId] = useState(0);
  const [lastFound, setLastFound] = useState(0);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [toJoin, setToJoin] = useState("");
  const [joined, setJoined] = useState(false);
  const [winner,setWinner] =useState(null)
  // Refs for logic that needs to be accessed without stale closures
  const ws = useRef(null);
  const isLockedRef = useRef(false);
  const processMoveRef = useRef();

  // Update the ref every render so the WebSocket always calls the "fresh" logic
  useEffect(() => {
    processMoveRef.current = processMove;
  });

  function joinRoom() {
    ws.current = new WebSocket("ws://100.129.160.22:8080");

    ws.current.onopen = () => {
      const joinMsg = { type: "JOIN", roomId: toJoin };
      ws.current.send(JSON.stringify(joinMsg));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "JOIN_SUCCESS") {
        setJoined(true);
        setMyPlayerId(message.playerId);
        if (message.deck) setShuffledCards(message.deck);
      } 
      else if (message.type === "REMOTE_MOVE") {
        // ALWAYS call the ref, not the function directly
        isLockedRef.current=false
        processMoveRef.current(message.payload.index, message.payload.Cnumber);
      }
      else if(message.type === 'PAUSE_GAME'){
        isLockedRef.current=true;
        console.log(message.payload)
      }
      else if(message.type == 'START_GAME'){
        isLockedRef.current=false
        console.log("start game now")
      }
    };
  }

  function processMove(index, Cnumber) {
    
    if (isLockedRef.current || revealedIndices.includes(index)) return;
    
    // Use the values from the CURRENT render
    if (Cnumber === lastFound + 1) {
      setRevealedIndices((prev) => [...prev, index]);
      setLastFound(Cnumber);

      if(revealedIndices.length==9){
        setWinner(myPlayerId)
        console.log('over')

    }


    } else {
      // MISMATCH LOGIC
      isLockedRef.current = true;
      setRevealedIndices((prev) => [...prev, index]);

      setTimeout(() => {
        setRevealedIndices([]);
        setLastFound(0);
        setTurn((prev) => !prev); // Functional update to be safe
        isLockedRef.current = false;
      }, 1000);
    }
  }

  function handleCardClick(index, Cnumber) {
    const isMyTurn = (myPlayerId === 1 && turn) || (myPlayerId === 2 && !turn);
    
    // Check .current!
    if (isLockedRef.current) return;

    if (isMyTurn) {
      if (ws.current && ws.current.readyState === 1) {
        ws.current.send(JSON.stringify({ 
          type: "MOVE", 
          payload: { index, Cnumber } 
        }));
      }
    } else {
      console.log("Not your turn!");
    }
  }

  useEffect(() => {
    if (toJoin) {
      joinRoom();
    }
    // Cleanup on unmount
    return () => ws.current?.close();
  }, [toJoin]);

  if (!joined) {
    return <RoomJoin setJoined={setToJoin} />;
  }
  if(winner){
    return(
      <div className="winner-screen">
      <h1>YOU ARE THE</h1>
      <h4 style={{ color: ((turn && winner === 1) || (!turn && winner === 2)) ? 'green' : 'red' }}>
        {((turn && winner === 1) || (!turn && winner === 2)) 
          ? "WINNER !" 
          : "LOOSER"}
      </h4>
          <button className="end-game" onClick={()=>{window.location.reload()}}>Take me back to home</button>
      </div>
    )
  }
  return (
    <div className="app">
      <h1>Card Game</h1>
      <h4>Room ID: {toJoin}</h4>
      <h2>You are: Player {myPlayerId}</h2>
      
      <h4 style={{ color: ((turn && myPlayerId === 1) || (!turn && myPlayerId === 2)) ? 'green' : 'red' }}>
        {((turn && myPlayerId === 1) || (!turn && myPlayerId === 2)) 
          ? "Your Turn!" 
          : "Waiting for Opponent..."}
      </h4>

      <div className="card-grid">
        {shuffledCards.map((value, index) => (
          <Card
            key={index}
            index={index}
            Cnumber={value}
            onCardClick={handleCardClick}
            isRevealed={revealedIndices.includes(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;