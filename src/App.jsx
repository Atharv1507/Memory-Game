import { useState, useEffect, useRef } from "react";
import "./App.css";
import Card from "./components/Card";
import RoomJoin from "./components/Roomjoin";

function App() {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [turn, setTurn] = useState(true);
  const [myPlayerId,setMyPlayerId]=useState(0)

  const [lastFound, setLastFound] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [toJoin, setToJoin] = useState("");
  const [joined, setJoined] = useState(false);
  const ws = useRef(null);

  function joinRoom() {
    ws.current = new WebSocket("ws://100.129.167.175:8080");

    ws.current.onopen = () => {
      const joinMsg = { type: "JOIN", roomId: toJoin };
      ws.current.send(JSON.stringify(joinMsg));
    };
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "JOIN_SUCCESS") {
        setJoined(true);
        setMyPlayerId(message.playerId)
        if (message.deck) {
          setShuffledCards(message.deck);
        }
      } 
      else if (message.type === "REMOTE_MOVE") {
        processMove(message.payload.index, message.payload.Cnumber)
        console.log("Remote move:", message);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  function processMove(index,Cnumber){
    if(isLocked) return
    
    if(Cnumber===lastFound+1){
      setRevealedIndices((prev) => [...prev, index])
      setLastFound(Cnumber);
    }
    else{
      setIsLocked(true)
      setRevealedIndices((prev)=>[...prev ,index])

      setTimeout(()=>{
        setRevealedIndices([])
        setTurn(prevTurn => !prevTurn)
        setLastFound(0)
        setIsLocked(false);
      },1000)
    }
  }

  function handleCardClick(index,Cnumber){
    const isMyturn=((myPlayerId===1 && turn )|| (myPlayerId==2 &&!turn))
    if (isLocked) return;
    if(isMyturn){

      if(ws.current && ws.current.readyState===1 ){
        ws.current.send(JSON.stringify({type:"MOVE" , payload:{index,Cnumber}}))
      }
      processMove(index,Cnumber)
    }
    else{
      console.log("not your turn",myPlayerId)
    }
  }

  useEffect(() => {
    if (toJoin) {
      joinRoom();
    }
  }, [toJoin]);

  if (!joined) {
    return <RoomJoin setJoined={setToJoin} />;
  }
  return (
    <div className="app">
      <h1>Card Game</h1>
      <h4>Room id:{toJoin}</h4>
      <h2>You are: Player {myPlayerId}</h2>
      <h4 style={{ color: ((turn && myPlayerId === 1) || (!turn && myPlayerId === 2)) ? 'green' : 'red' }}>
      {((turn && myPlayerId === 1) || (!turn && myPlayerId === 2)) ? "Your Turn!" : "Waiting for Opponent..."}
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
