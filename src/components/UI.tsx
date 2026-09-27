import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';

export function Badge({
  children,
  tone = 'blue',
}: {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'amber' | 'gray' | 'coral';
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function SectionTitle({
  title,
  sub,
  action,
  onAction,
}: {
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action && (
        <button className="text-button" onClick={onAction}>
          {action}
          <ArrowUpRight size={15} />
        </button>
      )}
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label="生活移行進捗"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
  drawer = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`modal ${wide ? 'modal-wide' : ''} ${drawer ? 'drawer' : ''}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="modal-heading">
        <div>
          <div className="eyebrow">FAMILY MOVE SUPPORT</div>
          <h2>{title}</h2>
        </div>
        <button aria-label="閉じる" className="icon-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function StepTimeline({
  complete = false,
  scenario = 'B',
}: {
  complete?: boolean;
  scenario?: string;
}) {
  const labels = [
    'Family Check',
    '初回面談',
    'Plan作成',
    '実行準備',
    scenario === 'A' ? '家族で転居' : '先行着任',
    scenario === 'C' ? '生活の見直し' : '合流判断',
    '移行完了',
  ];
  return (
    <div className="step-timeline">
      {labels.map((label, i) => (
        <div
          className={`timeline-step ${complete || i < 3 ? 'finished' : i === 3 ? 'current' : ''}`}
          key={label}
        >
          <span className="timeline-dot">
            {complete || i < 3 ? <Check size={13} /> : i === 3 ? <span /> : i + 1}
          </span>
          <span>{label}</span>
          {i === 3 && !complete && <small>いまここ</small>}
        </div>
      ))}
    </div>
  );
}
