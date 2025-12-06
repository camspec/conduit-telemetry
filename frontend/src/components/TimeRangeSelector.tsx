import type { PresetValue, TimeRange } from "../types.ts";

type TimeRangeButtonProps = {
  value: PresetValue;
  activeTimeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
};

type TimeRangeSelectorProps = {
  timeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
};

function TimeRangeButton({
  value,
  activeTimeRange,
  onTimeRangeChange,
}: TimeRangeButtonProps) {
  const isActive =
    activeTimeRange.type === "preset" && activeTimeRange.value === value;
  return (
    <button
      onClick={() => onTimeRangeChange({ type: "preset", value: value })}
      className={`px-3 py-1 rounded-lg ${isActive ? "bg-blue-400" : "bg-slate-700 hover:bg-slate-600 cursor-pointer"}`}
    >
      {value}
    </button>
  );
}

export default function TimeRangeSelector({
  timeRange,
  onTimeRangeChange,
}: TimeRangeSelectorProps) {
  const timeRanges: PresetValue[] = ["1H", "6H", "24H", "7D", "30D"];
  return (
    <div className="space-x-3">
      {timeRanges.map((t) => (
        <TimeRangeButton
          key={t}
          value={t}
          activeTimeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      ))}
    </div>
  );
}
