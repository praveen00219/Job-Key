import { recentActivity } from "@/lib/mockDashboardData";

export function ActivityFeed() {
  return (
    <ul className="divide-y divide-grey-100">
      {recentActivity.map((item) => (
        <li key={item.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
          <span className={`grid size-9 shrink-0 place-items-center rounded-full ${item.iconBg}`}>
            <item.icon className={`size-4 ${item.iconClass}`} />
          </span>
          <div className="min-w-0">
            <p className="text-body-sm text-grey-800">
              {item.name && <span className="font-semibold text-grey-950">{item.name} </span>}
              {item.action}
            </p>
            <p className="mt-0.5 text-body-xs text-grey-400">{item.timestamp}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
