import { MOODS } from "../utils/moodConfig.js";

export default function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {MOODS.map((mood) => {
        const isActive = selectedMood === mood.id;
        return (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-night text-paper"
                : "bg-mist text-ink/70 hover:bg-sand"
            }`}
          >
            <span aria-hidden="true">{mood.emoji}</span>
            {mood.label}
          </button>
        );
      })}
    </div>
  );
}
