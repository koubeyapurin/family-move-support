import { Check, Clock3 } from 'lucide-react';
import { Badge } from './UI';
import type { Task } from '../data';

export default function TaskList({
  tasks,
  onToggle,
  compact = false,
}: {
  tasks: Task[];
  onToggle: (id: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={`task-list ${compact ? 'compact' : ''}`}>
      {tasks.map((task) => (
        <div className={`task-row ${task.status === 'done' ? 'task-done' : ''}`} key={task.id}>
          <label className="task-check">
            <input
              type="checkbox"
              checked={task.status === 'done'}
              onChange={() => onToggle(task.id)}
              aria-label={`${task.title}を完了にする`}
            />
            <span>{task.status === 'done' && <Check size={14} />}</span>
          </label>
          <div className="task-info">
            <span className="task-title">{task.title}</span>
            <div className="task-meta">
              <span className={`owner-dot ${task.owner === '妻' ? 'pink' : ''}`} />
              {task.owner}
              <span className="task-category">{task.category}</span>
            </div>
          </div>
          {!compact && (
            <Badge
              tone={
                task.status === 'done' ? 'green' : task.status === 'in_progress' ? 'blue' : 'gray'
              }
            >
              {task.status === 'done'
                ? '完了'
                : task.status === 'in_progress'
                  ? '進行中'
                  : '未着手'}
            </Badge>
          )}
          <span className="task-date">
            <Clock3 size={13} />
            {task.due}
          </span>
        </div>
      ))}
    </div>
  );
}
