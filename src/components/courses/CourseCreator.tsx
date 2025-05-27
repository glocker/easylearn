"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/types/Card";
import { db } from "@/utils/firebase";
import { collection, addDoc } from "firebase/firestore";

export const CourseCreator = () => {
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState({
    frontText: "",
    backText: "",
  });

  const handleAddCard = () => {
    if (currentCard.frontText && currentCard.backText) {
      const newCard: Card = {
        id: Date.now().toString(),
        ...currentCard,
        createdBy: user?.id || "",
        createdAt: new Date(),
      };
      setCards([...cards, newCard]);
      setCurrentCard({ frontText: "", backText: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, "courses"), {
        title,
        description,
        category,
        cards,
        createdBy: user.id,
        createdAt: new Date(),
      });

      // Clear form
      setTitle("");
      setDescription("");
      setCategory("");
      setCards([]);
    } catch (error) {
      console.error("Error while loading course occured:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">New course creation</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Adding cards</h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Text on first side"
              value={currentCard.frontText}
              onChange={(e) =>
                setCurrentCard({ ...currentCard, frontText: e.target.value })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Text on other side"
              value={currentCard.backText}
              onChange={(e) =>
                setCurrentCard({ ...currentCard, backText: e.target.value })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleAddCard}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add card
            </button>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Added cards ({cards.length}):
            </h4>
            <div className="space-y-2">
              {cards.map((card, index) => (
                <div key={card.id} className="p-3 bg-gray-50 rounded-md">
                  <p>
                    Карточка {index + 1}: {card.frontText} - {card.backText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Create course
        </button>
      </form>
    </div>
  );
};
