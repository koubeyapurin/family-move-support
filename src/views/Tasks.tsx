import { useState } from 'react';
import { Check, Flag, ListChecks, MessageSquare } from 'lucide-react';
import type { DemoState } from '../data';
import { getProgress } from '../lib/recommendation';
import { Badge, PageHeading, Progress, StepTimeline } from '../components/UI';
import TaskList from '../components/TaskList';

export default function Tasks({
  state,
  onTask,
  onComplete,
  onConcierge,
}: {
  state: DemoState;
  onTask: (id: number) => void;
  onComplete: () => void;
  onConcierge: () => void;
}) {
  const [filter, setFilter] = useState('all');
  const done = state.tasks.filter((t) => t.status === 'done').length;
  const tasks = state.tasks.filter(
    (t) => filter === 'all' || (filter === 'done' ? t.status === 'done' : t.status !== 'done'),
  );
  return (
    <>
      <PageHeading
        eyebrow="ONE STEP AT A TIME"
        title="やること"
        description="本人でなくても進められることは、JTBが先回りします。"
      >
        <button className="button secondary" onClick={onConcierge}>
          <MessageSquare size={16} />
          コンシェルジュに相談
        </button>
      </PageHeading>
      <div className="task-progress card">
        <span className="large-icon">
          <ListChecks size={27} />
        </span>
        <div>
          <h2>
            {state.complete
              ? '新しい暮らしが、始まりました。'
              : '小さな一歩が、新しい暮らしにつながります。'}
          </h2>
          <p>
            今週のタスク {done} / {state.tasks.length} 件完了
          </p>
          <Progress value={getProgress(state)} />
        </div>
        <strong>
          {getProgress(state)}
          <small>%</small>
        </strong>
      </div>
      <div className="card all-tasks">
        <div className="section-heading">
          <div>
            <h2>今週のアクション</h2>
            <p>2026年10月12日 — 10月18日</p>
          </div>
          <Badge tone="blue">ご家族とJTBで進める</Badge>
        </div>
        <div className="filter-tabs">
          {[
            { id: 'all', label: 'すべて', count: 5 },
            { id: 'active', label: '未完了', count: 5 - done },
            { id: 'done', label: '完了', count: done },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={filter === item.id ? 'active' : ''}
            >
              {item.label}
              <span>{item.count}</span>
            </button>
          ))}
        </div>
        {tasks.length ? (
          <TaskList tasks={tasks} onToggle={onTask} />
        ) : (
          <div className="empty-state">
            <Check size={32} />
            <h3>
              {filter === 'done'
                ? 'ここに、完了したタスクが並びます。'
                : '今週のタスクはすべて完了しました。'}
            </h3>
            <p>
              {filter === 'done'
                ? '一つ終わったら、チェックを入れてみましょう。'
                : '次回の家族面談で、これからのことを確認しましょう。'}
            </p>
          </div>
        )}
      </div>
      <section className="card journey-card">
        <h2>生活移行の全体像</h2>
        <StepTimeline complete={state.complete} scenario={state.recommendedScenarioId} />
      </section>
      <div className="completion-banner">
        <div>
          <h2>
            <Flag size={20} />
            {state.complete ? 'Transition Complete' : '準備の先に、新しい日常を。'}
          </h2>
          <p>
            {state.complete
              ? '生活移行を完了として記録しました。これからの暮らしも、応援しています。'
              : '家族の生活移行が完了したら、最後のチェックを。すべてのタスク完了後に記録できます。'}
          </p>
        </div>
        <button
          className="button secondary"
          disabled={done !== 5 && !state.complete}
          onClick={onComplete}
        >
          {state.complete ? '完了を取り消す' : 'Transition Complete'}
          <Check size={16} />
        </button>
      </div>
    </>
  );
}
