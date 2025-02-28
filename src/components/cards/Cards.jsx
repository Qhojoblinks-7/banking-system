import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FlipCard from "./FlipCard";
import CardForm from "./CardForm";
import { fetchCards } from "../store/cardsSlice"; // adjust the path as needed

const Card = () => {
  const dispatch = useDispatch();
  const { cards, fetchStatus, error } = useSelector((state) => state.cards);

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  const handleDelete = (cardId) => {
    // TODO: Implement delete functionality via a Redux thunk if needed.
    console.log("Delete card with id:", cardId);
  };

  return (
    <div className="flex flex-col items-center py-10">
      <CardForm />
      {fetchStatus === "loading" && <p>Loading cards...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        {cards && cards.map((card) => (
          <FlipCard 
            key={card.id} 
            {...card} 
            onDelete={() => handleDelete(card.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Card;
