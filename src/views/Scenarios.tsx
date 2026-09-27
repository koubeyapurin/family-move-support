import {
  ArrowRight,
  Baby,
  BriefcaseBusiness,
  Check,
  GitBranch,
  Heart,
  Info,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react';
import { scenarioData, type DemoState, type PriorityKey, type ScenarioId } from '../data';
import { calculateRecommendation } from '../lib/recommendation';
import { Badge, PageHeading } from '../components/UI';

export default function Scenarios({
  state,
  onReplan,
  onPlan,
}: {
  state: DemoState;
  onReplan: () => void;
  onPlan: () => void;
}) {
  const { scores, ratings } = calculateRecommendation(state.conditions, state.priorities);
  const rows: { key: PriorityKey; label: string }[] = [
    { key: 'liveTogether', label: '家族同居' },
    { key: 'spouseCareer', label: '妻のキャリア' },
    { key: 'childStability', label: '子どもの生活' },
    { key: 'moveSpeed', label: '着任期限への対応' },
    { key: 'costSensitivity', label: '費用の抑えやすさ' },
  ];
  return (
    <>
      <PageHeading
        eyebrow="FIND YOUR FAMILY'S WAY"
        title="3つの生活シナリオを比較しました"
        description="答えを選ぶ前に、選択肢を見える化する。ご家族の希望・仕事・保育環境から考えます。"
      >
        <button className="button secondary" onClick={onReplan}>
          <RefreshCw size={16} />
          条件が変わったら？
        </button>
      </PageHeading>
      <div className="priorities-strip">
        <Heart size={17} />
        <strong>ご家族が大切にしたいこと</strong>
        <span>
          家族同居 <b>{state.priorities.liveTogether}/5</b>
        </span>
        <span>
          妻の仕事 <b>{state.priorities.spouseCareer}/5</b>
        </span>
        <span>
          子どもの安定 <b>{state.priorities.childStability}/5</b>
        </span>
      </div>
      <div className="scenario-grid">
        {(['A', 'B', 'C'] as ScenarioId[]).map((id) => {
          const item = scenarioData[id];
          const recommended = id === state.recommendedScenarioId;
          const Icon = id === 'A' ? Users : id === 'B' ? GitBranch : BriefcaseBusiness;
          return (
            <section className={`card scenario-card ${recommended ? 'recommended' : ''}`} key={id}>
              {recommended && (
                <div className="recommended-ribbon">
                  <Sparkles size={14} />
                  いまのご家族におすすめ
                </div>
              )}
              <div className="scenario-card-top">
                <span className="scenario-letter">
                  {id}
                  <small>案</small>
                </span>
                <span className="scenario-icon">
                  <Icon size={27} strokeWidth={1.5} />
                </span>
              </div>
              <h2>{item.short}</h2>
              <p className="scenario-description">{item.description}</p>
              <div className="scenario-family">
                <span>
                  <BriefcaseBusiness size={16} />夫
                </span>
                {id === 'A' ? <span className="family-connect" /> : <ArrowRight size={16} />}
                <span>
                  <Heart size={16} />妻
                </span>
                <span>
                  <Baby size={16} />子
                </span>
                <small>
                  {id === 'A' ? '一緒に転居' : id === 'B' ? '後日合流' : '今の暮らしを継続'}
                </small>
              </div>
              <div className="fit-score">
                <span>ご家族との適合度</span>
                <div>
                  <strong>{scores[id]}</strong>
                  <small>/ 100</small>
                </div>
                <div className="score-track">
                  <span style={{ width: `${scores[id]}%` }} />
                </div>
              </div>
              <div className="rating-list">
                {rows.map((row) => (
                  <div key={row.key}>
                    <span>{row.label}</span>
                    <div className="rating-dots" aria-label={`${ratings[id][row.key]} / 5`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <i
                          key={index}
                          className={index < Math.round(ratings[id][row.key]) ? 'filled' : ''}
                        />
                      ))}
                    </div>
                    <strong className={ratings[id][row.key] >= 4 ? 'green' : 'muted'}>
                      {ratings[id][row.key] >= 4 ? '◎' : ratings[id][row.key] >= 3 ? '○' : '△'}
                    </strong>
                  </div>
                ))}
              </div>
              <div className="scenario-note">
                <span>費用</span>
                <p>{item.cost}</p>
                <span>家族への負担</span>
                <p>{item.burden}</p>
                <span>確認しておきたいこと</span>
                <p>{item.risk}</p>
              </div>
              {recommended && (
                <button className="button primary full-width" onClick={onPlan}>
                  この案のPlanを見る
                  <ArrowRight size={16} />
                </button>
              )}
              {!recommended && (
                <div className="scenario-alternative">
                  <Check size={14} />
                  条件に応じて再検討できる選択肢
                </div>
              )}
            </section>
          );
        })}
      </div>
      <section className="recommendation-reason">
        <span className="reason-icon">
          <Sparkles size={23} />
        </span>
        <div>
          <h2>なぜ、{state.recommendedScenarioId}案がおすすめ？</h2>
          <p>{scenarioData[state.recommendedScenarioId].reason}</p>
        </div>
        <Badge>ご家族の希望を反映</Badge>
      </section>
      <div className="replan-banner">
        <div>
          <span className="eyebrow">LIFE CHANGES. YOUR PLAN CAN, TOO.</span>
          <h2>家族の状況が変わったら、Planも変えていい。</h2>
          <p>異動の可否や保育園の見通し。新しい情報が、次の選択につながります。</p>
        </div>
        <button className="button secondary" onClick={onReplan}>
          <RefreshCw size={17} />
          条件を変えて再計算する
        </button>
      </div>
      <p className="quiet-note">
        <Info size={14} />
        推奨はご家族の意思決定を支えるための目安です。最終的な選択は、コンシェルジュと一緒に考えます。
      </p>
    </>
  );
}
