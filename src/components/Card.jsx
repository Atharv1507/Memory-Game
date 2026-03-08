// Card.jsx
import cardImg from "../assets/card.png";

function Card({ Cnumber, index, isRevealed, onCardClick }) {
  return (
    <div
      className={isRevealed ? "card-show" : "card-hide"}
      onClick={() => onCardClick(index, Cnumber)}
    >
      {!isRevealed ? (
        <img className="cardFront" src={cardImg} alt="back" />
      ) : (
        <p>{Cnumber}</p>
      )}
    </div>
  );
}
export default Card;