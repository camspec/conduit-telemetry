export interface Device {
  id: number;
  name: string;
  category: string;
  data_type: string;
  created_at: string;
}

export interface NumericDatapoint {
  type: "numeric";
  id: number;
  reading: number;
  unit?: string;
  recorded_at: string;
}

export interface TextDatapoint {
  type: "text";
  id: number;
  reading: string;
  recorded_at: string;
}
