export const MOODS = [
  { id: "quick-bite", label: "Quick Bite", emoji: "🍔", type: "restaurant" },
  { id: "coffee", label: "Coffee", emoji: "☕", type: "cafe" },
  { id: "date-night", label: "Date Night", emoji: "❤️", type: "restaurant" },
  { id: "work-spot", label: "Work Spot", emoji: "💻", type: "library" },
  { id: "nature", label: "Nature", emoji: "🌳", type: "park" },
  { id: "shopping", label: "Shopping", emoji: "🛍", type: "shopping_mall" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬", type: "movie_theater" },
];

export function moodToType(moodId) {
  const mood = MOODS.find((m) => m.id === moodId);
  return mood ? mood.type : "restaurant";
}
