import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GitBranch,
  HeartHandshake,
  House,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  createInitialState,
  type Conditions,
  type DemoState,
  type Family,
  type Priorities,
  type View,
} from './data';
import { calculateRecommendation, changeReason } from './lib/recommendation';
import { loadState, saveState } from './lib/storage';
import { Concierge, PlanPreview, ReplanModal, SharingModal } from './components/Panels';
import { Modal } from './components/UI';
import Dashboard from './views/Dashboard';
import Scenarios from './views/Scenarios';
import FamilyCheck from './views/FamilyCheck';
import Plan from './views/Plan';
import Tasks from './views/Tasks';

const navItems = [
  { id: 'dashboard' as const, label: 'ダッシュボード', icon: LayoutDashboard },
  { id: 'check' as const, label: 'Family Move Check', icon: ClipboardCheck },
  { id: 'scenarios' as const, label: 'シナリオ比較', icon: GitBranch },
  { id: 'plan' as const, label: 'Family Move Plan', icon: FileText },
  { id: 'tasks' as const, label: 'やること', icon: ListChecks },
];
type Panel = 'replan' | 'sharing' | 'concierge' | 'reset' | 'preview' | null;

export default function App() {
  const [state, setState] = useState<DemoState>(loadState);
  const [view, setView] = useState<View>('dashboard');
  const [panel, setPanel] = useState<Panel>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [storageOk, setStorageOk] = useState(true);
  const [unread, setUnread] = useState(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setStorageOk(saveState(state));
  }, [state]);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!mobileOpen) return;
    function close(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [mobileOpen]);
  function notify(text: string) {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4500);
  }
  function navigate(next: View) {
    setView(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function concierge() {
    setPanel('concierge');
    setUnread(false);
    setMobileOpen(false);
  }
  function replan() {
    setPanel('replan');
  }
  function updatePlan(
    conditions: Conditions,
    family = state.family,
    priorities = state.priorities,
  ) {
    setState((previous) => {
      const recommendation = calculateRecommendation(conditions, priorities).recommended;
      const version = previous.planVersion + 1;
      const housingTask =
        recommendation === 'A' ? '家族の新居候補と入居日を確認' : '夫の一時住居候補を確認';
      return {
        ...previous,
        family,
        priorities,
        conditions,
        recommendedScenarioId: recommendation,
        planVersion: version,
        agreed: false,
        complete: false,
        tasks: previous.tasks.map((task) =>
          task.id === 4 && task.title !== housingTask
            ? { ...task, title: housingTask, status: 'todo' }
            : task,
        ),
        history: [
          ...previous.history,
          {
            version,
            date: '2026/10/12',
            from: previous.recommendedScenarioId,
            to: recommendation,
            reason: changeReason(
              previous.conditions,
              conditions,
              previous.recommendedScenarioId,
              recommendation,
            ),
          },
        ],
      };
    });
    notify('Family Move Planを再設計しました');
  }
  function saveCheck(family: Family, priorities: Priorities, conditions: Conditions) {
    updatePlan(conditions, family, priorities);
    navigate('scenarios');
    notify('ご家族の情報を保存し、シナリオを更新しました');
  }
  function toggleTask(id: number) {
    const task = state.tasks.find((t) => t.id === id)!;
    setState((previous) => ({
      ...previous,
      complete: false,
      tasks: previous.tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? (t.id <= 2 ? 'in_progress' : 'todo') : 'done' }
          : t,
      ),
    }));
    notify(
      task.status === 'done'
        ? 'タスクを未完了に戻しました'
        : 'タスクを完了しました。新しい暮らしに、また一歩。',
    );
  }
  function reset() {
    setState(createInitialState());
    setPanel(null);
    setUnread(true);
    navigate('dashboard');
    notify('デモを初期状態に戻しました');
  }
  const currentLabel = navItems.find((item) => item.id === view)?.label;
  const sidebar = (
    <>
      <a
        className="brand"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate('dashboard');
        }}
        aria-label="Family Move Support ダッシュボード"
      >
        <span className="brand-symbol">
          <House size={24} strokeWidth={1.6} />
          <HeartHandshake size={12} />
        </span>
        <span>
          Family Move
          <strong>
            Support<span className="brand-by">by JTB</span>
          </strong>
        </span>
      </a>
      <div className="workspace-family">
        <span className="family-initial">佐</span>
        <div>
          <strong>佐藤様ご家族</strong>
          <small>Family workspace</small>
        </div>
        <span className="workspace-check">
          <Check size={13} />
        </span>
      </div>
      <span className="nav-label">MY FAMILY MOVE</span>
      <nav aria-label="メインナビゲーション">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${view === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
            aria-current={view === item.id ? 'page' : undefined}
          >
            <item.icon size={19} />
            <span>{item.label}</span>
            {item.id === 'tasks' && (
              <span className="nav-counter">
                {state.tasks.filter((t) => t.status !== 'done').length}
              </span>
            )}
            {item.id === 'dashboard' && view === item.id && <span className="active-dot" />}
          </button>
        ))}
        <button className="nav-item" onClick={concierge}>
          <MessageSquare size={19} />
          <span>メッセージ</span>
          {unread && <span className="message-count">1</span>}
        </button>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-support">
          <span className="sidebar-support-icon">
            <HeartHandshake size={22} />
          </span>
          <h3>家族のこれからを、一緒に。</h3>
          <p>
            迷ったときは、いつでも
            <br />
            専任コンシェルジュへ。
          </p>
          <button onClick={concierge}>
            相談する
            <ArrowRight size={14} />
          </button>
        </div>
        <button
          className="nav-item privacy-button"
          onClick={() => {
            setPanel('sharing');
            setMobileOpen(false);
          }}
        >
          <ShieldCheck size={18} />
          プライバシー設定
        </button>
        <div className="sidebar-footer">
          <span className="jtb-wordmark">JTB</span>
          <span>
            Family Move Support
            <br />
            <small>Presentation prototype</small>
          </span>
        </div>
      </div>
    </>
  );
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        メインコンテンツへ
      </a>
      <aside className="sidebar">{sidebar}</aside>
      {mobileOpen && (
        <>
          <button
            className="mobile-backdrop"
            aria-label="ナビゲーションを閉じる"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="mobile-sidebar">
            <button
              className="icon-button mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="メニューを閉じる"
            >
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </>
      )}
      <div className="app-main">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-button"
            aria-label="メニューを開く"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            <span>マイページ</span>
            <ChevronRight size={14} />
            <strong>{currentLabel}</strong>
          </div>
          <div className="topbar-actions">
            <span className="demo-badge">
              <span />
              DEMO
            </span>
            <button className="reset-button" onClick={() => setPanel('reset')}>
              <RotateCcw size={14} />
              <span>デモを初期状態に戻す</span>
            </button>
            <span className="topbar-divider" />
            <button
              className="icon-button notification-button"
              aria-label="新しいメッセージを見る"
              onClick={concierge}
            >
              <Bell size={19} />
              {unread && <i />}
            </button>
            <button
              className="account-button"
              onClick={() => navigate('check')}
              aria-label="ご家族の情報を確認"
            >
              <span>佐</span>
              <ChevronDown size={13} />
            </button>
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          <div className="view-enter" key={view}>
            {view === 'dashboard' && (
              <Dashboard
                state={state}
                navigate={navigate}
                onTask={toggleTask}
                onConcierge={concierge}
                onReplan={replan}
              />
            )}
            {view === 'scenarios' && (
              <Scenarios state={state} onReplan={replan} onPlan={() => navigate('plan')} />
            )}
            {view === 'check' && <FamilyCheck state={state} onSave={saveCheck} />}
            {view === 'plan' && (
              <Plan
                state={state}
                onTask={toggleTask}
                onReplan={replan}
                onSharing={() => setPanel('sharing')}
                onPreview={() => setPanel('preview')}
                onAgree={() => {
                  setState({ ...state, agreed: !state.agreed });
                  notify(
                    state.agreed
                      ? '家族の確認済みを取り消しました'
                      : 'ご家族の方針確認を記録しました',
                  );
                }}
              />
            )}
            {view === 'tasks' && (
              <Tasks
                state={state}
                onTask={toggleTask}
                onConcierge={concierge}
                onComplete={() => {
                  setState({ ...state, complete: !state.complete });
                  notify(
                    state.complete
                      ? '生活移行を進行中に戻しました'
                      : '新しい暮らしのスタート、おめでとうございます。',
                  );
                }}
              />
            )}
          </div>
          {!storageOk && (
            <div className="storage-warning" role="alert">
              ブラウザの保存領域を利用できません。この画面での操作は可能ですが、再読み込みすると初期状態に戻ります。
            </div>
          )}
        </main>
        <div className="save-indicator">
          <ShieldCheck size={12} />
          {storageOk
            ? 'ご家族のデータは、このブラウザに保存されています'
            : 'このセッション内で動作しています'}
        </div>
      </div>
      {panel === 'replan' && (
        <ReplanModal
          state={state}
          onClose={() => {
            setPanel(null);
          }}
          onApply={(conditions) => updatePlan(conditions)}
          onPlan={() => {
            setPanel(null);
            navigate('plan');
          }}
        />
      )}
      {panel === 'sharing' && (
        <SharingModal
          state={state}
          onClose={() => setPanel(null)}
          onSave={(sharing) => {
            setState({ ...state, sharing });
            setPanel(null);
            notify('情報共有の設定を保存しました');
          }}
        />
      )}
      {panel === 'concierge' && (
        <Concierge
          onClose={() => setPanel(null)}
          onPlan={() => {
            setPanel(null);
            navigate('plan');
          }}
        />
      )}
      {panel === 'preview' && <PlanPreview state={state} onClose={() => setPanel(null)} />}
      {panel === 'reset' && (
        <Modal title="デモを初期状態に戻しますか？" onClose={() => setPanel(null)}>
          <div className="reset-illustration">
            <RotateCcw size={28} />
          </div>
          <p className="modal-description">
            ご家族の入力情報・Planの更新履歴・タスクの完了状態・共有設定をリセットし、佐藤様ご家族の初期データに戻します。
          </p>
          <div className="reset-summary">
            <Sparkles size={17} />
            推奨 B案<span>Plan v1</span>
            <span>進捗 46%</span>
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setPanel(null)}>
              キャンセル
            </button>
            <button className="button primary" onClick={reset}>
              <RotateCcw size={15} />
              初期状態に戻す
            </button>
          </div>
        </Modal>
      )}
      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span>
              <Check size={16} />
            </span>
            {toast}
            <button className="icon-button" aria-label="通知を閉じる" onClick={() => setToast('')}>
              <X size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
