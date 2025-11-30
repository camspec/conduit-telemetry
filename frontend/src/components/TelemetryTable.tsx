import type { NumericDatapoint, TextDatapoint } from "../types.ts";

type TelemetryTableProps = {
  telemetry: NumericDatapoint[] | TextDatapoint[];
  isNumeric: boolean;
};

export default function TelemetryTable({
  telemetry,
  isNumeric,
}: TelemetryTableProps) {
  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-800 text-left">
          <tr>
            <th scope="col" className="px-4 py-2">
              Reading
            </th>
            {isNumeric && (
              <th scope="col" className="px-4 py-2">
                Unit
              </th>
            )}
            <th scope="col" className="px-4 py-2">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {telemetry.map((t) => (
            <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-2">{t.reading}</td>
              {isNumeric && (
                <td className="px-4 py-2">{(t as NumericDatapoint).unit}</td>
              )}
              <td className="px-4 py-2">
                {new Date(t.recorded_at).toLocaleString("en-CA", {
                  hour12: false,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
