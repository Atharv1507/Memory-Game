// Card.jsx
import cardImg from "../assets/card.png";

function Card({ Cnumber, index, isRevealed, onCardClick }) {
  return (
    <div
      className={isRevealed ? "card-show" : "card-hide"}
      onClick={() => onCardClick(index, Cnumber)}
    >
      {!isRevealed ? (
        null
      ) : (
        <p>{Cnumber}</p>
      )}
    </div>
  );
}
export default Card;