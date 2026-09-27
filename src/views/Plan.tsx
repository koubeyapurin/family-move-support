import {
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  FileText,
  Heart,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { priorityLabels, scenarioData, type DemoState, type PriorityKey } from '../data';
import { getUncertainties } from '../lib/recommendation';
import { Badge, PageHeading, SectionTitle, StepTimeline } from '../components/UI';
import TaskList from '../components/TaskList';

export default function Plan({
  state,
  onReplan,
  onTask,
  onSharing,
  onPreview,
  onAgree,
}: {
  state: DemoState;
  onReplan: () => void;
  onTask: (id: number) => void;
  onSharing: () => void;
  onPreview: () => void;
  onAgree: () => void;
}) {
  const scenario = scenarioData[state.recommendedScenarioId];
  const history = state.history[state.history.length - 1];
  const priorities = (Object.keys(priorityLabels) as PriorityKey[]).filter(
    (key) => state.priorities[key] >= 4,
  );
  return (
    <>
      <PageHeading
        eyebrow="ONE FAMILY. ONE SHARED PLAN."
        title="Family Move Plan"
        description="家族全員の「大切にしたいこと」を、一つの計画へ。"
      >
        <button className="button secondary" onClick={onPreview}>
          <FileText size={16} />
          プレビュー
        </button>
        <button className="button primary" onClick={onReplan}>
          <RefreshCw size={16} />
          Planを見直す
        </button>
      </PageHeading>
      <div className="plan-document">
        <div className="plan-document-heading">
          <div>
            <h2>佐藤様ご家族の生活移行プラン</h2>
            <p>
              {state.family.currentLocation}
              <ArrowRight size={13} />
              {state.family.destination}{' '}
              <span>着任日：{state.family.transferDate.replaceAll('-', '/')}</span>
            </p>
          </div>
          <div>
            <Badge>Plan v{state.planVersion}</Badge>
            <small>{history.date} 更新</small>
          </div>
        </div>
        {state.planVersion > 1 && (
          <div className="plan-update">
            <RefreshCw size={17} />
            <div>
              <strong>新しい条件で、Planを再設計しました</strong>
              <p>{history.reason}</p>
            </div>
          </div>
        )}
        <section className="plan-hero">
          <div className="plan-hero-letter">
            {state.recommendedScenarioId}
            <span>案</span>
          </div>
          <div>
            <span className="eyebrow">
              <Sparkles size={14} />
              現在の推奨シナリオ
            </span>
            <h2>{scenario.description}</h2>
            <p>{scenario.reason}</p>
          </div>
        </section>
        <div className="plan-body">
          <SectionTitle
            title="ご家族の優先条件"
            sub="譲れないことと、柔軟に考えられることを整理しました。"
          />
          <div className="priority-cards">
            <div className="priority-card must">
              <Badge tone="coral">Must</Badge>
              <h3>大切に守りたいこと</h3>
              <p>夫の着任期限を守る</p>
              <p>子どもの生活を安定させる</p>
            </div>
            <div className="priority-card want">
              <Badge>Want</Badge>
              <h3>実現したい暮らし</h3>
              {priorities.length ? (
                priorities.slice(0, 3).map((key) => <p key={key}>{priorityLabels[key]}</p>)
              ) : (
                <p>バランスを見ながら家族で判断</p>
              )}
            </div>
            <div className="priority-card compromise">
              <Badge tone="gray">Compromise possible</Badge>
              <h3>柔軟に考えられること</h3>
              <p>
                {state.recommendedScenarioId === 'A'
                  ? '転居前の集中的な準備'
                  : '一時的に離れて暮らすこと'}
              </p>
              <p>段階的に生活を移すこと</p>
            </div>
          </div>
          <div className="plan-detail-grid">
            <section>
              <SectionTitle title="これから一緒に整理すること" />
              <div className="uncertainty-list">
                {getUncertainties(state.conditions).map((item) => (
                  <div key={item.label}>
                    <span>
                      {item.resolved ? (
                        <Check size={16} className="green" />
                      ) : (
                        <CircleHelp size={16} />
                      )}
                      {item.label}
                    </span>
                    <Badge tone={item.resolved ? 'green' : 'amber'}>{item.value}</Badge>
                  </div>
                ))}
              </div>
            </section>
            <section className="risk-card">
              <h3>
                <TriangleAlert size={18} />
                気にかけておきたいこと
              </h3>
              <p>{scenario.risk}</p>
              {state.conditions.caregiving && <p>親族の介護体制を地域の専門窓口と確認します。</p>}
              {state.conditions.ownedHome && <p>持家の管理・賃貸・売却を専門会社と整理します。</p>}
              <span>コンシェルジュが専門サービスと連携して支援します。</span>
            </section>
          </div>
          <SectionTitle title="これからのスケジュール" />
          <div className="plan-schedule">
            <div>
              <span>10月上旬</span>
              <strong>条件の確認・候補の比較</strong>
              <small>仕事・住まい・保育を並行して整理</small>
            </div>
            <div>
              <span>10/16</span>
              <strong>家族面談・方針の確認</strong>
              <small>ご家族とJTBで、次の一歩を決定</small>
            </div>
            <div>
              <span>{state.family.transferDate.slice(5).replace('-', '/')}</span>
              <strong>
                {state.recommendedScenarioId === 'A' ? '家族で転居・着任' : '夫の先行着任'}
              </strong>
              <small>{scenario.timing}</small>
            </div>
            <div>
              <span>{state.recommendedScenarioId === 'A' ? '転居後' : '条件が整い次第'}</span>
              <strong>
                {state.recommendedScenarioId === 'A'
                  ? '新生活のフォロー'
                  : state.recommendedScenarioId === 'B'
                    ? '妻子が合流'
                    : '生活状況の見直し'}
              </strong>
              <small>定期面談で暮らしをサポート</small>
            </div>
          </div>
          <SectionTitle title="次にやること" sub="誰が、いつまでに。実行まで一緒に進めます。" />
          <TaskList tasks={state.tasks} onToggle={onTask} />
          <div className="agreement-box">
            <span className="large-icon">
              <Heart size={22} />
            </span>
            <div>
              <h3>
                {state.agreed ? 'ご家族で方針を確認しました' : 'ご家族みんなで、次の一歩を。'}
              </h3>
              <p>
                {state.agreed
                  ? '状況が変わったら、いつでもPlanを見直せます。'
                  : '推奨プランを話し合い、家族で確認したらチェックしましょう。'}
              </p>
            </div>
            <button
              className={`button ${state.agreed ? 'secondary' : 'primary'}`}
              onClick={onAgree}
            >
              <Check size={16} />
              {state.agreed ? '確認済みを取り消す' : '家族で確認しました'}
            </button>
          </div>
          <div className="plan-detail-grid">
            <section>
              <SectionTitle title="Planの更新履歴" />
              <div className="history-list">
                {[...state.history].reverse().map((item) => (
                  <div key={item.version}>
                    <span className="history-version">v{item.version}</span>
                    <div>
                      <strong>
                        {item.version === 1
                          ? '初回Planを作成'
                          : `${item.from}案 → ${item.to}案・条件を反映`}
                      </strong>
                      <p>{item.reason}</p>
                      <small>
                        <Clock3 size={11} />
                        {item.date}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="sharing-card">
              <ShieldCheck size={23} />
              <h3>勤務先への情報共有</h3>
              <p>ご家族が選んだ情報だけを共有する設定です。</p>
              <div>
                {state.sharing.progress && <Badge tone="gray">移行の進捗</Badge>}
                {state.sharing.schedule && <Badge tone="gray">着任スケジュール</Badge>}
                {state.sharing.family && <Badge tone="gray">ご家族の個別事情</Badge>}
                {!Object.values(state.sharing).some(Boolean) && (
                  <Badge tone="gray">すべて非共有</Badge>
                )}
              </div>
              <button className="text-button" onClick={onSharing}>
                共有範囲を確認する
                <ArrowRight size={14} />
              </button>
            </section>
          </div>
          <StepTimeline complete={state.complete} scenario={state.recommendedScenarioId} />
        </div>
      </div>
    </>
  );
}
