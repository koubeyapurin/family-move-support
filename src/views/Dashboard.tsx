import {
  ArrowRight,
  ArrowUpRight,
  Baby,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  GitBranch,
  Heart,
  MapPin,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import { type DemoState, type View, scenarioData } from '../data';
import { getProgress, getUncertainties } from '../lib/recommendation';
import { Badge, PageHeading, Progress, SectionTitle, StepTimeline } from '../components/UI';
import JourneyArt from '../components/JourneyArt';
import TaskList from '../components/TaskList';

interface Props {
  state: DemoState;
  navigate: (view: View) => void;
  onTask: (id: number) => void;
  onConcierge: () => void;
  onReplan: () => void;
}
export default function Dashboard({ state, navigate, onTask, onConcierge, onReplan }: Props) {
  const id = state.recommendedScenarioId;
  const scenario = scenarioData[id];
  const progress = getProgress(state);
  const uncertainties = getUncertainties(state.conditions).filter((item) => !item.resolved);
  const title =
    id === 'B'
      ? `夫が先に${state.family.destination.split('・')[0]}へ。\n妻子は、準備が整ってから。`
      : scenario.title;
  return (
    <>
      <PageHeading
        eyebrow="YOUR FAMILY, YOUR NEXT CHAPTER"
        title="こんにちは、佐藤さん。"
        description="ご家族の生活移行を、一つずつ整理していきましょう。"
      >
        <button className="meeting-card" onClick={onConcierge}>
          <span className="icon-tile">
            <CalendarDays size={21} />
          </span>
          <span>
            <small>次回の家族面談</small>
            <strong>
              10月16日 <span>19:00</span>
            </strong>
            <small>
              <Video size={12} />
              オンライン面談
            </small>
          </span>
          <ChevronRight size={16} />
        </button>
      </PageHeading>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            <FileCheck2 size={17} />
            現在のフェーズ
          </div>
          <div className="stat-value phase">
            {state.complete ? '生活移行完了' : 'Plan作成済み'}
            <span className="tiny-check">
              <Check size={12} />
            </span>
          </div>
          <span className="stat-caption">ご家族の希望を、実行プランに</span>
        </div>
        <button className="stat-card stat-clickable" onClick={() => navigate('scenarios')}>
          <div className="stat-label">
            <GitBranch size={17} />
            推奨シナリオ
          </div>
          <div className="stat-value blue">
            {id}
            <span>案</span>
            <Badge>おすすめ</Badge>
          </div>
          <span className="stat-caption">
            {scenario.short}
            <ArrowUpRight size={13} />
          </span>
        </button>
        <button className="stat-card stat-clickable" onClick={() => navigate('check')}>
          <div className="stat-label">
            <CircleHelp size={17} />
            一緒に整理すること
          </div>
          <div className="stat-value">
            {uncertainties.length}
            <span>件</span>
            <span className="stat-context">未確定事項</span>
          </div>
          <span className="stat-caption">
            まだ決まっていなくても、大丈夫
            <ArrowUpRight size={13} />
          </span>
        </button>
        <div className="stat-card">
          <div className="stat-label">
            <TrendingUp size={17} />
            生活移行の進捗
          </div>
          <div className="stat-value">
            {progress}
            <span>%</span>
            <span className="stat-context green">少しずつ、前へ</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>
      <div className="dashboard-columns">
        <section className="recommendation-card">
          <div className="recommendation-top">
            <span className="eyebrow">
              <Sparkles size={15} />
              YOUR FAMILY MOVE PLAN
            </span>
            <span className="version-label">Plan v{state.planVersion}</span>
          </div>
          <div className="recommendation-copy">
            <div className="plan-label">
              <Badge>いまのご家族へのおすすめ</Badge>
              <span>{id}案</span>
            </div>
            <h2>{title}</h2>
            <p>
              誰が、いつ、どこで、どう暮らすか。
              <br />
              家族みんなの大切なことから、考えました。
            </p>
            <ul className="benefit-list">
              {scenario.benefits.map((item) => (
                <li key={item}>
                  <Check size={15} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <JourneyArt />
          <div className="recommendation-actions">
            <button className="button primary" onClick={() => navigate('scenarios')}>
              3つのシナリオを比較する
              <ArrowRight size={16} />
            </button>
            <button className="text-button" onClick={onReplan}>
              条件が変わったら？
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
        <section className="card family-card">
          <SectionTitle
            title="佐藤様ご家族"
            action="確認・編集"
            onAction={() => navigate('check')}
          />
          <div className="family-route">
            <MapPin size={14} />
            <span>{state.family.currentLocation}</span>
            <ArrowRight size={14} />
            <strong>{state.family.destination}</strong>
          </div>
          <div className="family-member">
            <span className="avatar avatar-blue">
              <BriefcaseBusiness size={21} />
            </span>
            <div>
              <strong>
                健太さん <small>夫・34歳</small>
              </strong>
              <p>
                {state.family.transferDate.slice(5).replace('-', '/')} までに
                {state.family.destination}へ着任
              </p>
            </div>
          </div>
          <div className="family-member">
            <span className="avatar avatar-pink">
              <Heart size={21} />
            </span>
            <div>
              <strong>
                美咲さん <small>妻・32歳</small>
              </strong>
              <p>{state.family.employment}・仕事の継続を希望</p>
              <Badge tone={state.conditions.spouseTransfer === 'possible' ? 'green' : 'amber'}>
                {state.conditions.spouseTransfer === 'possible'
                  ? '関西への異動が可能'
                  : state.conditions.spouseTransfer === 'unavailable'
                    ? '関西への異動は不可'
                    : '関西への異動を確認中'}
              </Badge>
            </div>
          </div>
          <div className="family-member">
            <span className="avatar avatar-yellow">
              <Baby size={21} />
            </span>
            <div>
              <strong>
                陽菜ちゃん <small>子ども・{state.family.childAge}歳</small>
              </strong>
              <p>{state.family.childcare}に通園中</p>
            </div>
          </div>
          <div className="family-footer">
            <Users size={15} />
            <span>家族{state.family.count}人の「これから」を、一つの計画に。</span>
          </div>
        </section>
        <section className="card dashboard-tasks">
          <SectionTitle
            title="今週の大切なこと"
            sub={`一つずつ進めましょう。残り${state.tasks.filter((t) => t.status !== 'done').length}件です。`}
            action="すべて見る"
            onAction={() => navigate('tasks')}
          />
          <TaskList tasks={state.tasks.slice(0, 4)} onToggle={onTask} compact />
        </section>
        <section className="card concierge-card">
          <div className="concierge-heading">
            <span className="concierge-avatar">
              JTB
              <span />
            </span>
            <div>
              <h2>いつも、そばに。</h2>
              <p>あなたの専任コンシェルジュ</p>
            </div>
            <span className="new-dot" />
          </div>
          <div className="message-preview">
            <span className="message-date">
              JTBコンシェルジュ <small>10/12 10:30</small>
            </span>
            <p>
              保育園の申請条件を整理しました。
              <br />
              次回面談までに、候補エリアを
              <br className="desktop-break" />
              一緒に確認していきましょう。
            </p>
          </div>
          <button className="button secondary full-width" onClick={onConcierge}>
            <MessageSquare size={16} />
            メッセージを見る<span className="count-badge">1</span>
            <ChevronRight size={15} />
          </button>
          <p className="concierge-footnote">住まい・仕事・保育の専門家と連携して伴走します。</p>
        </section>
      </div>
      <section className="card journey-card">
        <SectionTitle
          title="新しい暮らしまでの道のり"
          sub="準備から、その先の生活まで。ご家族のペースで。"
        />
        <StepTimeline complete={state.complete} scenario={id} />
      </section>
      <div className="page-footer">
        <span>引越しを支援するのではなく、家族の生活を移す。</span>
        <span>
          Family Move Support <span className="footer-dot">•</span> by JTB
        </span>
      </div>
    </>
  );
}
