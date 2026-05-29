import Link from "next/link";
import { Task } from "@/lib/types";
import { formatNaira, formatDate, propertyTypeLabels } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  fulfilled: "bg-emerald-100 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Link
      href={`/agent/tasks/${task.id}`}
      className="block bg-white rounded-lg border border-gray-200/60 p-3 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
    >
      <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">{task.title}</h4>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusStyles[task.status] || "bg-gray-100 text-gray-700"}`}>
          {task.status.replace("_", " ")}
        </span>
        <span className="text-[10px] text-gray-400">{propertyTypeLabels[task.propertyType]}</span>
      </div>
      <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500">
        <span>{formatNaira(task.budget)}</span>
        <span>Due: {formatDate(task.deadline)}</span>
      </div>
    </Link>
  );
}

interface TaskCardProps {
  task: Task;
}
