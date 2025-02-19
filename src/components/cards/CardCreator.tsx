import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface CardCreatorProps {
  courseId: string;
  onCardCreated?: () => void;
}

interface Card {
  question: string;
  answer: string;
}

export const CardCreator = ({ courseId, onCardCreated }: CardCreatorProps) => {
  const [card, setCard] = useState<Card>({
    question: "",
    answer: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!card.question.trim() || !card.answer.trim()) {
      setError("Both question and answer are required");
      return;
    }

    setIsLoading(true);
    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, {
        cards: arrayUnion({
          question: card.question.trim(),
          answer: card.answer.trim(),
        }),
      });

      // Reset form
      setCard({ question: "", answer: "" });

      // Notify parent component
      if (onCardCreated) {
        onCardCreated();
      }
    } catch (err) {
      console.error("Error creating card:", err);
      setError("Failed to create card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-light text-gray-800 mb-6 text-center">
          Create New Card
        </h3>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Question
            </label>
            <textarea
              value={card.question}
              onChange={(e) => setCard({ ...card, question: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows={3}
              placeholder="Enter your question here..."
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Answer
            </label>
            <textarea
              value={card.answer}
              onChange={(e) => setCard({ ...card, answer: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows={3}
              placeholder="Enter the answer here..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200 font-medium"
          >
            {isLoading ? "Creating..." : "Create Card"}
          </button>
        </form>
      </div>
    </div>
  );
};
