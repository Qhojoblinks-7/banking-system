import { useState } from "react";
import FlipCard from "./FlipCard";
import CardForm from "./CardForm";

const initialCards = [
  {
    bank: "Visa",
    cardNumber: "**** **** **** 1234",
    holderName: "John Doe",
    expiry: "12/27",
    cvv: "123",
  },
  {
    bank: "MasterCard",
    cardNumber: "**** **** **** 5678",
    holderName: "Alice Brown",
    expiry: "06/25",
    cvv: "456",
  },
];

const Card= () => {
  const [cards, setCards] = useState(initialCards);

  const addCard = (newCard) => {
    setCards([...cards, newCard]);
  };

  const deleteCard = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center py-10">
      <CardForm addCard={addCard} />
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        {cards.map((card, index) => (
          <FlipCard key={index} {...card} onDelete={() => deleteCard(index)} />
        ))}
      </div>
    </div>
  );
};

export default Card;
