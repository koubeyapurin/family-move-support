import { useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleCheck,
  HeartHandshake,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';
import { scenarioData, type Conditions, type DemoState } from '../data';
import { calculateRecommendation } from '../lib/recommendation';
import { Badge, Modal } from './UI';
import { ConditionFields } from '../views/FamilyCheck';

export function ReplanModal({
  state,
  onClose,
  onApply,
  onPlan,
}: {
  state: DemoState;
  onClose: () => void;
  onApply: (conditions: Conditions) => void;
  onPlan: () => void;
}) {
  const [conditions, setConditions] = useState({ ...state.conditions });
  const [before] = useState(state.recommendedScenarioId);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(false);
  const preview = calculateRecommendation(conditions, state.priorities);
  async function apply() {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onApply(conditions);
    setBusy(false);
    setResult(true);
  }
  return (
    <Modal
      title={result ? 'ご家族のPlanを再設計しました' : '状況に変化がありましたか？'}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      {!result ? (
        <>
          <p className="modal-description">
            家族の状況が変わったら、Planも変えていい。
            <br />
            新しい情報を反映して、3つの生活シナリオをもう一度比較します。
          </p>
          <div className="current-plan-mini">
            <GitBranchIcon />
            <span>現在の推奨</span>
            <strong>{before}案</strong>
            <span>{scenarioData[before].short}</span>
          </div>
          <ConditionFields conditions={conditions} onChange={setConditions} />
          <div className="info-box">
            <HeartHandshake size={19} />
            <p>
              まだ分からない項目は、そのままで大丈夫です。確認できたことから少しずつ更新しましょう。
            </p>
          </div>
          <div className="modal-actions">
            <button disabled={busy} className="button secondary" onClick={onClose}>
              キャンセル
            </button>
            <button disabled={busy} className="button primary" onClick={apply}>
              {busy ? <LoaderCircle size={17} className="spin" /> : <RefreshCw size={17} />}
              {busy ? '家族の条件を再整理しています…' : '新しい条件で再計算'}
            </button>
          </div>
        </>
      ) : (
        <div className="replan-result">
          <span className="result-check">
            <Check size={29} />
          </span>
          <Badge tone="green">Plan v{state.planVersion} に更新</Badge>
          <h3>
            {before === preview.recommended
              ? 'いまの選択に、もう一つの安心を。'
              : '新しい条件から、新しい選択肢へ。'}
          </h3>
          <div className="result-comparison">
            <div>
              <span>これまで</span>
              <strong>
                {before}
                <small>案</small>
              </strong>
            </div>
            <ArrowRight size={26} />
            <div>
              <span>新しいおすすめ</span>
              <strong>
                {preview.recommended}
                <small>案</small>
              </strong>
            </div>
          </div>
          <h3>{scenarioData[preview.recommended].short}</h3>
          <p>{state.history.at(-1)?.reason}</p>
          <button className="button primary full-width" onClick={onPlan}>
            更新されたFamily Move Planを見る
            <ArrowRight size={16} />
          </button>
          <button className="text-button" onClick={onClose}>
            元の画面に戻る
          </button>
        </div>
      )}
    </Modal>
  );
}
function GitBranchIcon() {
  return <Sparkles size={16} />;
}

export function SharingModal({
  state,
  onClose,
  onSave,
}: {
  state: DemoState;
  onClose: () => void;
  onSave: (sharing: DemoState['sharing']) => void;
}) {
  const [sharing, setSharing] = useState({ ...state.sharing });
  const items: { key: keyof typeof sharing; label: string; description: string }[] = [
    { key: 'progress', label: '生活移行の進捗', description: '準備の進み具合・サポートの利用状況' },
    { key: 'schedule', label: '着任スケジュール', description: '着任日・転居の予定' },
    { key: 'family', label: 'ご家族の個別事情', description: '配偶者の仕事・保育・介護などの詳細' },
  ];
  return (
    <Modal title="ご家族の情報共有を設定" onClose={onClose}>
      <p className="modal-description">
        勤務先へ共有する情報を、ご家族で選べます。
        <br />
        個別の事情は、初期設定では共有されません。
      </p>
      <div className="privacy-hero">
        <ShieldCheck size={30} />
        <span>
          必要な情報を、必要な相手に。
          <br />
          <strong>ご家族の意思を大切にします。</strong>
        </span>
      </div>
      <div className="toggle-fields">
        {items.map((item) => (
          <label key={item.key}>
            <span>
              {item.label}
              <small>{item.description}</small>
            </span>
            <input
              type="checkbox"
              className="switch"
              checked={sharing[item.key]}
              onChange={(e) => setSharing({ ...sharing, [item.key]: e.target.checked })}
            />
          </label>
        ))}
      </div>
      <p className="quiet-note">デモ用の設定です。実際の企業への送信は行われません。</p>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>
          キャンセル
        </button>
        <button className="button primary" onClick={() => onSave(sharing)}>
          <Check size={16} />
          共有設定を保存
        </button>
      </div>
    </Modal>
  );
}

export function Concierge({ onClose, onPlan }: { onClose: () => void; onPlan: () => void }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <Modal title="あなたのコンシェルジュ" onClose={onClose} drawer>
      <div className="drawer-concierge">
        <span className="concierge-avatar">
          JTB
          <span />
        </span>
        <div>
          <h3>JTBコンシェルジュ</h3>
          <p>
            <span className="online-dot" />
            ご家族の生活移行をサポート
          </p>
        </div>
      </div>
      <div className="drawer-intro">
        <HeartHandshake size={17} />
        住まい・仕事・保育の専門家と連携しています。
      </div>
      <div className="conversation">
        <div className="conversation-date">2026年10月12日</div>
        <div className="chat-message">
          <span>
            JTBコンシェルジュ <small>10:30</small>
          </span>
          <p>
            保育園の申請条件を整理しました。
            <br />
            候補エリアごとの違いをFamily Move Planに反映しています。
            <br />
            <br />
            次回面談までに候補エリアをご確認ください。
          </p>
          <button className="chat-plan" onClick={onPlan}>
            <span>
              <FileIcon />
              Family Move Plan
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="chat-message mine">
          <span>
            佐藤様ご家族 <small>10:42</small>
          </span>
          <p>
            ありがとうございます。
            <br />
            妻の勤務先への確認結果は明日分かる予定です。
          </p>
        </div>
        <div className="chat-message">
          <span>
            JTBコンシェルジュ <small>10:45</small>
          </span>
          <p>
            承知しました。
            <br />
            結果が分かり次第、3つの生活シナリオを再比較します。一緒に、ご家族に合った進め方を見つけていきましょう。
          </p>
        </div>
        {messages.map((text, i) => (
          <div className="chat-message mine" key={i}>
            <span>
              佐藤様ご家族 <small>デモ送信</small>
            </span>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <div className="drawer-meeting">
        <CalendarDays size={20} />
        <div>
          <strong>次回の家族面談</strong>
          <span>
            10月16日（金）19:00 <Video size={13} />
            オンライン
          </span>
        </div>
      </div>
      <form
        className="chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (message.trim()) {
            setMessages([...messages, message.trim()]);
            setMessage('');
          }
        }}
      >
        <input
          aria-label="コンシェルジュへのメッセージ"
          placeholder="メッセージを入力…"
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="icon-button"
          aria-label="メッセージをデモ送信"
          disabled={!message.trim()}
        >
          <Send size={18} />
        </button>
      </form>
      <p className="chat-disclaimer">デモの会話です。入力内容は外部に送信されません。</p>
    </Modal>
  );
}
function FileIcon() {
  return <MessageSquare size={16} />;
}

export function PlanPreview({ state, onClose }: { state: DemoState; onClose: () => void }) {
  return (
    <Modal title="Family Move Plan プレビュー" onClose={onClose} wide>
      <div className="preview-sheet">
        <div className="preview-brand">
          Family Move Support <span>by JTB</span>
        </div>
        <span className="eyebrow">YOUR FAMILY MOVE PLAN / v{state.planVersion}</span>
        <h2>
          佐藤様ご家族の
          <br />
          新しい暮らしへの計画
        </h2>
        <p>
          {state.family.currentLocation} → {state.family.destination} ｜ 着任日{' '}
          {state.family.transferDate.replaceAll('-', '/')}
        </p>
        <hr />
        <Badge>推奨 {state.recommendedScenarioId}案</Badge>
        <h3>{scenarioData[state.recommendedScenarioId].description}</h3>
        <p>{scenarioData[state.recommendedScenarioId].reason}</p>
        <h4>大切にしたいこと</h4>
        <p>
          家族同居 {state.priorities.liveTogether}/5　妻の仕事 {state.priorities.spouseCareer}
          /5　子どもの安定 {state.priorities.childStability}/5
        </p>
        <h4>次のアクション</h4>
        {state.tasks.map((t) => (
          <div className="preview-task" key={t.id}>
            <CircleCheck size={14} />
            <span>{t.title}</span>
            <small>
              {t.due}・{t.owner}
            </small>
          </div>
        ))}
        <hr />
        <p className="muted">引越しを支援するのではなく、家族の生活を移す。</p>
        <small>Family Move Support デモ用プレビュー</small>
      </div>
      <div className="modal-actions">
        <button className="button primary" onClick={onClose}>
          Planに戻る
        </button>
      </div>
    </Modal>
  );
}
