import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import { useDevice } from "../hooks/useDevice.ts";
import { useTelemetry } from "../hooks/useTelemetry.ts";
import DeviceInfo from "./DeviceInfo.tsx";
import TelemetryTable from "./TelemetryTable.tsx";
import TelemetryAreaChart from "./TelemetryAreaChart.tsx";
import TelemetryStepLineChart from "./TelemetryStepLineChart.tsx";
import TimeRangeSelector from "./TimeRangeSelector.tsx";
import type { NumericDatapoint, TextDatapoint, TimeRange } from "../types.ts";

function telemetryReducer(
  state: NumericDatapoint[] | TextDatapoint[],
  action:
    | { type: "SET_INITIAL"; payload: NumericDatapoint[] | TextDatapoint[] }
    | { type: "ADD_DATAPOINT"; payload: NumericDatapoint | TextDatapoint },
): NumericDatapoint[] | TextDatapoint[] {
  switch (action.type) {
    case "SET_INITIAL":
      return action.payload;
    case "ADD_DATAPOINT":
      return [...state, action.payload] as NumericDatapoint[] | TextDatapoint[];
    default:
      return state;
  }
}

export default function DeviceDetail() {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    type: "preset",
    value: "24H",
  });

  const params = useParams();

  const {
    data: device,
    error: deviceError,
    isError: deviceIsError,
    isPending: deviceIsPending,
  } = useDevice(params.deviceId);

  const {
    data: telemetry,
    error: telemetryError,
    isError: telemetryIsError,
    isPending: telemetryIsPending,
  } = useTelemetry({ deviceId: params.deviceId, timeRange: timeRange });

  const [liveTelemetry, dispatch] = useReducer(
    telemetryReducer,
    telemetry || [],
  );

  useEffect(() => {
    if (telemetry) {
      dispatch({ type: "SET_INITIAL", payload: telemetry });
    }
  }, [telemetry]);

  useEffect(() => {
    const ws = new WebSocket("/ws");

    ws.onopen = () => {
      console.log("Connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (
        message.type === "telemetry_update" &&
        message.deviceId === params.deviceId
      ) {
        dispatch({
          type: "ADD_DATAPOINT",
          payload: {
            id: message.data.id,
            reading: message.data.reading,
            unit: message.data.unit,
            recorded_at: message.data.recordedAt,
          },
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [params.deviceId]);

  if (deviceIsPending) {
    return <p className="p-10">Loading device...</p>;
  }
  if (deviceIsError) {
    return <p className="p-10 text-red-400">Error: {deviceError.message}</p>;
  }

  if (telemetryIsPending) {
    return <p className="p-10">Loading telemetry...</p>;
  }
  if (telemetryIsError) {
    return <p className="p-10 text-red-400">Error: {telemetryError.message}</p>;
  }

  const isNumeric = device.data_type === "numeric";

  return (
    <div className="bg-slate-900 p-10 rounded-xl">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="space-y-10 lg:flex-1">
          <Link
            to="/devices"
            className="inline-block text-blue-400 hover:text-blue-300"
          >
            &lt;- Back to devices
          </Link>
          <h2 className="font-bold text-xl">{device.name}</h2>
          <DeviceInfo device={device} />
          <TimeRangeSelector
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          {isNumeric ? (
            <TelemetryAreaChart
              telemetry={liveTelemetry as NumericDatapoint[]}
            />
          ) : (
            <TelemetryStepLineChart
              telemetry={liveTelemetry as TextDatapoint[]}
            />
          )}
        </div>
        <div className="lg:flex-1">
          <TelemetryTable telemetry={liveTelemetry} isNumeric={isNumeric} />
        </div>
      </div>
    </div>
  );
}
