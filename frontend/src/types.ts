export interface Device {
  id: number;
  name: string;
  category: string;
  data_type: string;
  created_at: string;
}

export interface NumericDatapoint {
  id: number;
  reading: number;
  unit?: string;
  recorded_at: string;
}

export interface TextDatapoint {
  id: number;
  reading: string;
  recorded_at: string;
}

export type PresetValue = "1H" | "6H" | "24H" | "7D" | "30D";

export type TimeRange =
  | { type: "preset"; value: PresetValue }
  | { type: "custom"; start: string; end: string };
