import type { Filter } from "../types/task";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export default function TaskFilter({
  filter,
  onChange
}: Props) {

  const filters: Filter[] = [
    "all",
    "active",
    "completed"
  ];

  return (
    <div className="filters">

      {filters.map((item) => (
        <button
          key={item}
          className={
            filter === item
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() => onChange(item)}
        >
          {item[0].toUpperCase() + item.slice(1)}
        </button>
      ))}

    </div>
  );
}