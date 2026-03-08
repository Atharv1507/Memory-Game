import { useRef } from "react"

export default function RoomJoin({setJoined}){
    const roomRef=useRef()
    function handleSubmit(e){
    e.preventDefault(); // Stop the page from refreshing
    
    const roomId = roomRef.current.value;
    
    if (roomId.trim() !== "") {
      console.log("Joining room:", roomId);
      setJoined(roomId); // Pass the ID up to your App component
  };
    }
    return(
        <form id='joinForm'  onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter room id" ref={roomRef}/>
            <button type="submit">Enter the room</button>

        </form>
    )
}
