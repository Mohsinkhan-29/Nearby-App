export default function FilterBar({ filters, onChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-sand py-3">
      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input
          type="checkbox"
          checked={filters.openNow}
          onChange={(e) => onChange({ ...filters, openNow: e.target.checked })}
          className="h-4 w-4 rounded border-sand accent-clay"
        />
        Open now
      </label>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        Min rating
        <select
          value={filters.minRating}
          onChange={(e) => onChange({ ...filters, minRating: Number(e.target.value) })}
          className="rounded-md border border-sand bg-white px-2 py-1 text-sm"
        >
          <option value={0}>Any</option>
          <option value={3}>3.0+</option>
          <option value={4}>4.0+</option>
          <option value={4.5}>4.5+</option>
        </select>
      </label>

      <div className="ml-auto flex items-center gap-2 text-sm text-ink/80">
        Sort by
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md border border-sand bg-white px-2 py-1 text-sm"
        >
          <option value="nearest">Nearest</option>
          <option value="rating">Highest rated</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  );
}
