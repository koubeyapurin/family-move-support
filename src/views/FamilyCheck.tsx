import { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  BriefcaseBusiness,
  Check,
  Heart,
  Home,
  Info,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  priorityLabels,
  type Conditions,
  type DemoState,
  type Family,
  type Priorities,
  type PriorityKey,
} from '../data';
import { Badge, PageHeading } from '../components/UI';

export function ConditionFields({
  conditions,
  onChange,
}: {
  conditions: Conditions;
  onChange: (conditions: Conditions) => void;
}) {
  return (
    <div className="condition-fields">
      <label className="field">
        <span>
          <BriefcaseBusiness size={16} />
          妻の関西異動
        </span>
        <select
          value={conditions.spouseTransfer}
          onChange={(e) =>
            onChange({
              ...conditions,
              spouseTransfer: e.target.value as Conditions['spouseTransfer'],
            })
          }
        >
          <option value="unknown">確認中</option>
          <option value="possible">可能</option>
          <option value="unavailable">不可</option>
        </select>
      </label>
      <label className="field">
        <span>
          <Home size={16} />
          リモート勤務
        </span>
        <select
          value={conditions.remoteWork}
          onChange={(e) =>
            onChange({ ...conditions, remoteWork: e.target.value as Conditions['remoteWork'] })
          }
        >
          <option value="unavailable">不可</option>
          <option value="partial">一部可能</option>
          <option value="full">完全可能</option>
        </select>
      </label>
      <label className="field">
        <span>
          <Baby size={16} />
          保育園受入見込み
        </span>
        <select
          value={conditions.childcareAvailability}
          onChange={(e) =>
            onChange({
              ...conditions,
              childcareAvailability: e.target.value as Conditions['childcareAvailability'],
            })
          }
        >
          <option value="unknown">不明</option>
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </label>
    </div>
  );
}
export default function FamilyCheck({
  state,
  onSave,
}: {
  state: DemoState;
  onSave: (family: Family, priorities: Priorities, conditions: Conditions) => void;
}) {
  const [step, setStep] = useState(0);
  const [family, setFamily] = useState({ ...state.family });
  const [priorities, setPriorities] = useState({ ...state.priorities });
  const [conditions, setConditions] = useState({ ...state.conditions });
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState('');
  function goToStep(next: number) {
    if (step === 0 && !formRef.current?.reportValidity()) return;
    setStep(next);
  }
  function save() {
    if (
      !family.destination.trim() ||
      !family.currentLocation.trim() ||
      !family.transferDate ||
      family.count < 1 ||
      family.count > 20 ||
      family.childAge < 0 ||
      family.childAge > 18
    ) {
      setStep(0);
      setError('転勤先・居住地・着任日と、ご家族の人数・年齢を確認してください。');
      return;
    }
    onSave(
      {
        ...family,
        destination: family.destination.trim(),
        currentLocation: family.currentLocation.trim(),
      },
      priorities,
      conditions,
    );
  }
  const change = <K extends keyof Family>(key: K, value: Family[K]) =>
    setFamily((previous) => ({ ...previous, [key]: value }));
  const titles = ['ご家族について', '大切にしたいこと', '未確定事項の整理'];
  return (
    <>
      <PageHeading
        eyebrow="START WITH WHAT MATTERS"
        title="Family Move Check"
        description="まだ決まっていなくても大丈夫です。未確定の条件も含めて、一緒に整理していきます。"
      >
        <Badge tone="green">
          <Check size={12} />
          サンプルデータ入力済み
        </Badge>
      </PageHeading>
      <div className="check-layout">
        <div>
          <div className="form-steps">
            {titles.map((title, i) => (
              <button
                key={title}
                className={step === i ? 'active' : ''}
                onClick={() => goToStep(i)}
              >
                <span>{step > i ? <Check size={16} /> : `0${i + 1}`}</span>
                {title}
              </button>
            ))}
          </div>
          <form
            ref={formRef}
            className="card check-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) setStep(step + 1);
              else save();
            }}
          >
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-heading">
              <span className="eyebrow">STEP 0{step + 1}</span>
              <h2>{titles[step]}</h2>
              <p>
                {step === 0
                  ? '転勤で生活が変わる、ご家族全体の状況を教えてください。'
                  : step === 1
                    ? '正解はありません。ご家族が大切にしたいことを教えてください。'
                    : '分からないことは、そのままで。コンシェルジュと一緒に確認します。'}
              </p>
            </div>
            {step === 0 && (
              <>
                <h3 className="form-section-title">
                  <BriefcaseBusiness size={18} />
                  転勤とご家族の基本情報
                </h3>
                <div className="form-grid">
                  <label className="field">
                    <span>転勤先</span>
                    <input
                      required
                      maxLength={40}
                      value={family.destination}
                      onChange={(e) => change('destination', e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>着任日</span>
                    <input
                      type="date"
                      required
                      min="2026-01-01"
                      max="2035-12-31"
                      value={family.transferDate}
                      onChange={(e) => change('transferDate', e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>現在の居住地</span>
                    <input
                      required
                      maxLength={40}
                      value={family.currentLocation}
                      onChange={(e) => change('currentLocation', e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>家族人数</span>
                    <input
                      required
                      type="number"
                      min="1"
                      max="20"
                      value={family.count}
                      onChange={(e) => change('count', Number(e.target.value))}
                    />
                  </label>
                </div>
                <h3 className="form-section-title">
                  <Heart size={18} />
                  配偶者の仕事
                </h3>
                <div className="form-grid">
                  <label className="field">
                    <span>勤務状況</span>
                    <select
                      value={family.employment}
                      onChange={(e) => change('employment', e.target.value)}
                    >
                      {[
                        '正社員',
                        '契約社員',
                        'パート・アルバイト',
                        '自営業',
                        '現在は働いていない',
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>仕事継続希望</span>
                    <select
                      value={family.continueWorking}
                      onChange={(e) => change('continueWorking', e.target.value)}
                    >
                      {['強い', 'できれば継続', '未定', '転職を検討'].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <h3 className="form-section-title">
                  <Baby size={18} />
                  お子さま・住まい・介護
                </h3>
                <div className="form-grid">
                  <label className="field">
                    <span>子どもの年齢</span>
                    <input
                      required
                      type="number"
                      min="0"
                      max="18"
                      value={family.childAge}
                      onChange={(e) => change('childAge', Number(e.target.value))}
                    />
                  </label>
                  <label className="field">
                    <span>現在の保育・教育環境</span>
                    <select
                      value={family.childcare}
                      onChange={(e) => change('childcare', e.target.value)}
                    >
                      {['認可保育園', '認可外保育園', '幼稚園', '小学校', '家庭で保育'].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="toggle-fields">
                  <label>
                    <span>
                      介護対象の親族がいる<small>一緒に転居しないご家族も支援の対象です。</small>
                    </span>
                    <input
                      className="switch"
                      type="checkbox"
                      checked={conditions.caregiving}
                      onChange={(e) =>
                        setConditions({ ...conditions, caregiving: e.target.checked })
                      }
                    />
                  </label>
                  <label>
                    <span>
                      現在の住まいは持家<small>売却・賃貸などの選択肢を一緒に整理します。</small>
                    </span>
                    <input
                      className="switch"
                      type="checkbox"
                      checked={conditions.ownedHome}
                      onChange={(e) =>
                        setConditions({ ...conditions, ownedHome: e.target.checked })
                      }
                    />
                  </label>
                </div>
              </>
            )}
            {step === 1 && (
              <div className="priority-sliders">
                {(Object.keys(priorityLabels) as PriorityKey[]).map((key, i) => (
                  <div className="priority-slider" key={key}>
                    <div>
                      <label htmlFor={key}>
                        <span className="priority-index">0{i + 1}</span>
                        {priorityLabels[key]}
                      </label>
                      <strong>
                        {priorities[key]}
                        <small>/ 5</small>
                      </strong>
                    </div>
                    <input
                      id={key}
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={priorities[key]}
                      onChange={(e) =>
                        setPriorities({ ...priorities, [key]: Number(e.target.value) })
                      }
                      style={{
                        background: `linear-gradient(to right, #2563eb ${(priorities[key] - 1) * 25}%, #e8eef6 0%)`,
                      }}
                    />
                    <div className="range-labels">
                      <span>柔軟に考えられる</span>
                      <span>とても大切</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {step === 2 && (
              <>
                <ConditionFields conditions={conditions} onChange={setConditions} />
                <div className="form-grid">
                  <label className="field">
                    <span>住居</span>
                    <select
                      value={conditions.housing}
                      onChange={(e) =>
                        setConditions({
                          ...conditions,
                          housing: e.target.value as Conditions['housing'],
                        })
                      }
                    >
                      <option value="unknown">候補検討前</option>
                      <option value="researching">候補を比較中</option>
                      <option value="decided">決定済み</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>合流時期</span>
                    <select
                      value={conditions.reunion}
                      onChange={(e) =>
                        setConditions({
                          ...conditions,
                          reunion: e.target.value as Conditions['reunion'],
                        })
                      }
                    >
                      <option value="unknown">未定</option>
                      <option value="discussing">家族で相談中</option>
                      <option value="decided">決定済み</option>
                    </select>
                  </label>
                </div>
                <div className="info-box">
                  <Info size={18} />
                  <p>
                    今の条件で3つのシナリオを比較します。条件が変われば、いつでもPlanを再設計できます。
                  </p>
                </div>
              </>
            )}
            <div className="form-actions">
              {step > 0 ? (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={16} />
                  戻る
                </button>
              ) : (
                <span className="muted text-small">入力内容は最後に保存されます</span>
              )}
              <button className="button primary" type="submit">
                {step === 2 ? '保存してシナリオを比較する' : '次へ進む'}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
        <aside className="check-aside">
          <span className="large-icon">
            <Users size={28} />
          </span>
          <h2>
            「家族」を、
            <br />
            意思決定のまんなかに。
          </h2>
          <p>
            転勤で変わるのは、
            <br />
            勤務地だけではありません。
          </p>
          <p>
            仕事、子育て、住まい、介護。
            <br />
            一人ひとりの大切にしたいことを、
            <br />
            一つの生活移行計画につなげます。
          </p>
          <div className="aside-divider" />
          <ShieldCheck size={22} />
          <h3>ご家族の情報を大切に</h3>
          <p>
            勤務先への共有範囲は、ご家族で設定できます。個別の事情は、初期設定では共有されません。
          </p>
        </aside>
      </div>
    </>
  );
}
