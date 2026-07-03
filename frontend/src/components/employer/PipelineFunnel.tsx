import { pipelineStages } from "@/lib/mockDashboardData";

/** Stage count boxes + a shrinking funnel bar chart, matching the Pipeline Overview card. */
export function PipelineFunnel() {
  return (
    <div>
      <div className="grid grid-cols-5 gap-3">
        {pipelineStages.map((stage) => (
          <div key={stage.label} className="rounded-md bg-grey-50 p-3">
            <p className="text-heading-md font-semibold text-grey-950">
              {String(stage.count).padStart(2, "0")}
            </p>
            <p className="mt-1 text-body-xs text-grey-500">{stage.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {pipelineStages.map((stage, i) => {
          const widthPct = 100 - i * 16;
          return (
            <div key={stage.label} className="flex items-center gap-3" style={{ paddingLeft: `${i * 5}%` }}>
              <div
                className={`flex h-9 items-center justify-between rounded-md px-3 ${stage.barClass}`}
                style={{ width: `${widthPct}%` }}
              >
                <span
                  className={`text-body-sm ${i >= 3 ? "text-white" : "text-grey-900"}`}
                >
                  {stage.label}
                </span>
                <span
                  className={`text-body-sm font-semibold ${i >= 3 ? "text-white" : "text-grey-900"}`}
                >
                  {String(stage.count).padStart(2, "0")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
