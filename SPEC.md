Family Move Support — MVP実装仕様書
0. この仕様書の目的
本仕様書は、新規サービス 「Family Move Support」 のプレゼン・デモ用Webプロトタイプを、Codex等のAIコーディングエージェントが追加質問なしで実装できる状態にすることを目的とする。
本番サービスの開発は目的としない。
最優先事項は以下。
1. 見た目の完成度が高いこと
2. 初見の人がサービス価値を理解できること
3. 「家族全体の意思決定を支援するサービス」であることが操作によって伝わること
4. 短時間で安定してデモできること
5. バックエンド、認証、DB、外部API等を極力作らないこと
サービスの本質は、単なる引越し手配やタスク管理ではない。
「家族まで支援する」のではなく、「家族を意思決定単位にする」。

この思想がUIから伝わることを最重要とする。
1. サービス概要
1.1 サービス名
Family Move Support
主要コピー：
引越しを支援するのではなく、家族の生活を移す。

補助コピー：
転勤で変わるのは、社員の勤務地だけではありません。
家族の仕事・保育・住居・介護まで、一つの生活移行計画に。

1.2 誰向けのサービスか
利用者
企業都合で国内転勤する社員と、その転勤によって生活が変化する家族。
対象になり得る人：
- 転勤社員本人
- 配偶者
- 子ども
- 転勤によって介護体制等が変わる親族
「家族」は一緒に引っ越す人だけを指さない。
転勤によって生活が変わる人

をFamily Move Planの対象とする。
契約者・支払者
原則として転勤を命じる企業。
BtoBtoCモデル。
1.3 解決する課題
企業は社員の「勤務地」を変更する。
しかし実際には、一度の転勤によって以下が同時に変化する。
- 配偶者の仕事
- 子どもの保育園・学校
- 住居
- 持家
- 親族の介護
- 家族が同居するか別居するか
- 転居時期
- 家計負担
- 新地域での生活
現在はそれぞれ、
- 不動産 → 不動産会社
- 引越 → 引越会社
- 配偶者の仕事 → 人材会社
- 保育 → 自治体
- 学校 → 学校・自治体
- 介護 → 地域包括支援センター・介護事業者
と支援先が分断されている。
そのため、
「この家族全体として、どう動くのがよいか」

を統合して考える主体がいない。
Family Move Supportは、この分断されたサービスの上に家族意思決定レイヤーを作る。
1.4 このプロトタイプで伝えたいこと
デモを見た人が、3分以内に以下を理解できること。
必ず伝わるべきポイント
① 単なる引越しサービスではない
家を探すことではなく、
誰が、いつ、どこで、どう暮らすか

を決めるサービス。
② 家族全体を一つの意思決定単位として扱う
夫だけでなく、妻・子ども・必要に応じて親族まで条件を整理する。
③ 複数シナリオを比較できる
例：
- A：家族全員ですぐ転居
- B：本人だけ先行し、妻子は後から合流
- C：一定期間の単身赴任
④ 未確定でも計画を始められる
「妻が異動できるかまだ分からない」状態でも進められる。
⑤ 状況が変わればPlan全体を再設計する
保育園に入れなかった等の条件変更を受けて、Replanできる。
⑥ JTBは専門会社を置き換えない
不動産、人材、介護等の専門サービスを束ねる役割。
2. 今回実装する範囲
2.1 必須機能
A. 高品質なダッシュボード
以下が一画面で分かること。
- 家族プロフィール
- 現在のフェーズ
- 推奨シナリオ
- 未確定事項
- 今週のTo Do
- 生活移行の進捗
- JTBコンシェルジュの存在
B. Family Move Check
家族の状況を簡単に入力できるフォーム。
最低限、
- 家族構成
- 転勤条件
- 配偶者の仕事
- 子どもの保育
- 介護有無
- 家族の優先順位
- 未確定事項
を入力できること。
フォームは最初からサンプルデータ入力済みにする。
C. シナリオ比較
以下3案を比較する。
- A：家族全員で早期転居
- B：本人先行 → 妻子後日合流
- C：一定期間の単身赴任
比較項目：
- 配偶者キャリア
- 子どもの生活
- 家族同居
- 着任期限
- 費用
- 家族負担
- リスク
- 総合適合度
最も条件に適した案を「推奨」と表示する。
D. Family Move Plan
以下をまとめた画面。
- 家族の優先条件
- 推奨シナリオ
- 推奨理由
- 未確定事項
- リスク
- 今後のアクション
- 担当者
- 期限
- スケジュール
- 情報共有範囲
E. Replan体験
このプロトタイプで最重要の操作体験の一つ。
ユーザーが条件変更を行うと、
推奨シナリオが変化する

こと。
例：
初期状態：
妻の関西異動：確認中
→ B案「夫先行」が推奨

条件変更：
妻の関西異動：可能

さらに、
保育園受入見込み：高

に変更すると、
A案「家族全員で早期転居」

が推奨になる。
「条件変更によって家族全体の計画が変わる」というサービス価値を視覚的に見せる。
F. To Do管理
以下が可能。
- タスク一覧表示
- 完了/未完了切り替え
- 完了すると進捗率が変化
- 担当者表示
- 期限表示
G. JTBコンシェルジュUI
本物のチャット機能は不要。
固定メッセージを表示するドロワーまたはパネルでよい。
「人が伴走している」ことを見せる。
H. LocalStorage
以下をLocalStorageに保存。
- Family Move Check入力
- 選択された条件
- タスク完了状態
- 推奨シナリオ
- Planバージョン
ブラウザ再読み込み後も状態を維持する。
I. デモリセット
ヘッダーに小さく、
「デモを初期状態に戻す」
ボタンを設置。
プレゼン中に何度でも最初から実演できるようにする。
2.2 あれば嬉しい機能
時間に余裕がある場合のみ実装。
- Toast通知
- 画面遷移アニメーション
- Plan更新履歴
- シナリオスコアの軽いアニメーション
- PDF風プレビュー
- 企業共有範囲設定モーダル
- 「新しいメッセージ」通知バッジ
- スマホ表示
- ダークモード
ただし必須ではない。
2.3 今回実装しないもの
以下は絶対に過剰実装しない。
- 本格認証
- Googleログイン
- SSO
- バックエンド
- DB
- Firebase
- Supabase
- 実際のチャット通信
- WebSocket
- 実際のメール通知
- LINE連携
- 実際のカレンダー連携
- Google Maps API
- 保育園API
- 不動産API
- 人材API
- AI API
- 決済
- 実PDF生成
- ファイルアップロード
- 本格的な管理者画面
- 法人請求管理
- 本格アクセスポリシー
- 正確な保育園判定
- 実際のJTBデータとの接続
必要なものはすべて固定データまたはフロントエンドロジックで代替する。
3. ユーザーフロー
基本デモフロー
STEP 1
ユーザーがWebアプリを開く。
最初からデモ用「佐藤家」のデータが読み込まれたダッシュボードを表示する。
画面上部には、
こんにちは、佐藤さん。
現在、ご家族の生活移行プランを作成しています。

と表示。
STEP 2
ダッシュボードで現在の状態を確認。
表示：
- 現在フェーズ：Family Move Plan作成済み
- 推奨：B案
- 未確定事項：4件
- 今週のTo Do：5件
- 進捗：46%
STEP 3
「Family Move Checkを見る」を押す。
家族情報と優先順位を確認する。
ユーザーは、
- 妻の仕事継続：5/5
- 家族同居：5/5
- 子どもの生活安定：5/5
などを確認。
STEP 4
「シナリオ比較を見る」を押す。
A/B/C案が表示される。
初期状態では、
B案：夫が先に大阪へ着任し、妻子は条件が整い次第合流

が推奨。
STEP 5
「条件が変わったら？」ボタンを押す。
Replanモーダルを表示。
以下を変更。
妻の関西異動
確認中 → 可能
保育園受入見込み
不明 → 高
STEP 6
「再計算する」を押す。
軽いローディング演出を300〜600ms表示。
その後、
Family Move Planを再設計しました

Toast。
推奨が、
B案 → A案
に変化する。
STEP 7
「更新されたFamily Move Planを見る」。
Plan画面に遷移。
画面上部：
Plan v2

変更理由：
妻の関西異動が可能になり、保育環境の見通しも改善したため、家族全員での早期転居を推奨候補に更新しました。

STEP 8
「やること」を開く。
ユーザーが、
妻の勤務先への異動確認

を完了にする。
ダッシュボード進捗が、
46% → 54%
などに更新。
STEP 9
JTBコンシェルジュパネルを開く。
固定メッセージ：
保育園の申請条件を整理しました。
次回面談までに候補エリアをご確認ください。

これで主要デモ終了。
4. 画面一覧
4.1 共通レイアウト
目的
法人向けSaaSのような統一感を作る。
レイアウト
PC表示時：
- 左：サイドバー 220〜240px
- 上：ヘッダー 64〜72px
- 右：メインコンテンツ
サイドバー
表示項目：
- Family Move Support
- ダッシュボード
- Family Move Check
- シナリオ比較
- Family Move Plan
- やること
- メッセージ
下部：
- プライバシー設定
- デモリセット
Lucide Iconsを使用。
候補：
- LayoutDashboard
- ClipboardCheck
- GitBranch
- FileText
- ListChecks
- MessageSquare
- ShieldCheck
- RotateCcw
4.2 Dashboard
目的
サービスを初めて見た人に、10秒で全体像を伝える。
表示情報
ヘッダー
こんにちは、佐藤さん
ご家族の生活移行を、一つずつ整理していきましょう。

右側：
次回面談
10月16日 19:00
オンライン

上部KPIカード
4枚。
1
現在のフェーズ
Plan作成済み

2
推奨シナリオ
B案
夫先行 → 後日合流

3
未確定事項
4件

4
生活移行進捗
46%

メインカード
現在の推奨プラン
大きく表示。
B案
夫が先に大阪へ着任し、
妻子は条件が整い次第合流

推奨理由：
- 夫の着任期限を守れる
- 妻の就業継続可能性を確認する時間が取れる
- 子どもの保育環境を急いで決めすぎずに済む
CTA：
シナリオ比較を見る
家族プロフィール
3人分のカード。
- 夫 34歳
- 妻 32歳
- 子ども 3歳
今週の重要タスク
最大4件。
チェックボックス付き。
進捗タイムライン
横型。
Check
✓

初回面談
✓

Plan
✓

実行準備
●

先行着任

合流判断

Transition Complete

4.3 Family Move Check
目的
家族全体の条件を整理していることを伝える。
UI
3ステップ式フォーム。
Step 1：ご家族について
入力：
転勤先
大阪・梅田

着任日
2026/10/26

現在の居住地
東京都

家族人数
3人

配偶者
勤務状況
正社員

仕事継続希望
強い

関西異動
確認中

フルリモート
不可

子ども
年齢
3歳

現在
認可保育園

転居後の保育
未確定

介護
介護対象親族
なし

デモではOFF。
ただしUI上は存在させる。
Step 2：家族が大切にしたいこと
5段階スライダー。
家族3人で暮らす
5

妻が仕事を続ける
5

子どもの生活を安定させる
5

費用を抑える
3

できるだけ早く転居を完了する
3

上に説明：
正解はありません。
ご家族が大切にしたいことを教えてください。

Step 3：未確定事項
カード型。
妻の関西異動
確認中

保育園
情報収集中

住居
候補検討前

合流時期
未定

CTA：
シナリオを比較する
4.4 シナリオ比較
目的
Family Move Support最大の価値を見せる画面。
この画面は特にデザイン品質を高くする。
上部
タイトル：
3つの生活シナリオを比較しました

補足：
ご家族の希望、着任期限、仕事、保育環境などをもとに比較しています。

シナリオカード
横3列。
A
A案
家族全員で早期に西宮へ

家族同居
◎

妻の仕事
△

子どもの安定
△

着任対応
○

費用
△

適合度
69

B
青く強調。
B案
夫が先に大阪へ
妻子は後日合流

推奨

家族同居
○

妻の仕事
◎

子どもの安定
◎

着任対応
◎

費用
△

適合度
79

C
C案
一定期間の単身赴任

家族同居
△

妻の仕事
◎

子どもの安定
◎

着任対応
◎

費用
○

適合度
77

※数値はデモ用内部スコアであり、実サービスの実証済み評価ではない。
UIには「適合度」とだけ表示。
推奨理由カード
なぜB案？

着任期限を守りながら、
妻の仕事と子どもの生活を急激に変えずに済むためです。

Replan CTA
目立つがPrimary CTAより少し控えめ。
条件が変わったら？ 再計算する
クリックでModal。
4.5 Replan Modal
目的
このサービス最大の差別化をデモする。
タイトル：
状況に変化がありましたか？

説明：
新しい情報を反映してFamily Move Planを再設計できます。

入力：
妻の関西異動
select
- 確認中
- 可能
- 不可
リモート勤務
- 不可
- 一部可能
- 完全可能
保育園受入見込み
- 不明
- 低
- 中
- 高
ボタン：
新しい条件で再計算
押下後：
500ms程度の疑似ローディング。
家族の条件を再整理しています…

その後結果更新。
4.6 Family Move Plan
目的
「このサービスでは何が成果物としてもらえるのか」を伝える。
上部
Family Move Plan
佐藤様ご家族

右上：
Plan v1
2026/10/08 更新

Replan後：
Plan v2
2026/10/12 更新

推奨プラン
大きなカード。
現在の推奨
B案

夫が先に大阪へ着任し、
妻子は条件が整い次第合流

家族の優先条件
3列カード。
Must
赤系ではなく柔らかいコーラル。
Must
・夫の着任期限を守る
・子どもの生活を安定させる

Want
青。
Want
・3人で暮らしたい
・妻が仕事を続けたい

Compromise possible
グレー。
Compromise possible
・一時的な別居
・段階的な転居

未確定事項
4件。
Status Chipを使用。
妻の関西異動
確認中

保育園
調査中

住居
未着手

合流日
未定

次にやること
表形式。
列：
- タスク
- 担当
- 期限
- 状態
Plan更新履歴
v1
初回Plan作成

v2
妻の異動可否を反映

Replan後のみv2表示。
4.7 やること
目的
JTBが単なる「相談」ではなく、実行まで伴走することを見せる。
表示
今週
1.
妻の勤務先に関西異動可否を確認
担当：妻
期限：10/12

2.
西宮周辺の住居候補を比較
担当：JTB
期限：10/13

3.
保育園の申請条件を整理
担当：JTB
期限：10/14

4.
夫の一時住居候補を確認
担当：JTB
期限：10/15

5.
次回家族面談
担当：家族＋JTB
期限：10/16

チェックで完了状態変更。
4.8 メッセージ / Concierge Panel
フル画面でも右ドロワーでもよい。
右ドロワー推奨。
幅：
360〜400px。
固定会話：
JTBコンシェルジュ
保育園の申請条件を整理しました。
候補エリアごとの違いをFamily Move Planに反映しています。

家族
ありがとうございます。
妻の勤務先への確認結果は明日分かる予定です。

JTB
承知しました。
結果が分かり次第、3つの生活シナリオを再比較します。

入力ボックスは表示してよいが、本当に送信しなくてもよい。
送信時はローカルの固定メッセージ追加程度で可。
5. UI・デザイン仕様
5.1 最優先デバイス
PCを最優先。
基準：
1440 × 900

プレゼン画面共有で最も美しく見える状態にする。
スマホは最低限崩れない程度でよい。
5.2 デザインの方向性
目標：
大手企業が導入していても違和感のない
「高品質な法人SaaS × 家族向けコンシェルジュ」

避ける：
- スタートアップ感が強すぎる派手なグラデーション
- ネオンカラー
- 黒背景
- ゲーム的なUI
- 子ども向けサービスのようなUI
- 無機質すぎる管理画面
5.3 カラー
CSS VariableまたはTailwind themeとして設定。
Primary Blue
#2563EB

Deep Navy
#173A63

Light Blue
#EAF3FF

Page Background
#F5F8FC

Card Background
#FFFFFF

Border
#DEE7F0

Main Text
#172033

Secondary Text
#667085

Success
#159A74

Warning
#D98A1D

Danger
#C94C63

優先条件：
Must BG
#FDECEF

Must Text
#C63F55

Want BG
#EAF3FF

Want Text
#2563EB

Compromise BG
#F0F3F6

Compromise Text
#667085

5.4 フォント
日本語優先。
font-family:
  "Noto Sans JP",
  "Hiragino Sans",
  "Yu Gothic",
  system-ui,
  sans-serif;

Web Font読み込みは必須ではない。
本番デモでネット接続がなくても壊れないことを優先。
5.5 タイポグラフィ
Page title：
28〜32px
font-weight: 700

Section title：
18〜22px
font-weight: 700

Card title：
15〜17px
font-weight: 600〜700

Body：
14〜15px
line-height: 1.6

Caption：
12〜13px

5.6 カード
border-radius: 14〜18px
border: 1px solid #DEE7F0
background: white

Shadow：
かなり薄く。
box-shadow:
0 4px 20px rgba(20, 45, 80, 0.05);

カード間余白：
16〜24px

5.7 ボタン
高さ：
40〜44px

Primary：
青背景＋白文字。
Secondary：
白背景＋青文字＋border。
Danger系は極力使用しない。
Hover：
- slight darkening
- transform: translateY(-1px) 程度
派手なアニメーション不要。
5.8 Badge / Status Chip
例：
推奨
進行中
確認待ち
完了
未着手

角丸：
9999px。
文字は12〜13px。
5.9 アイコン
lucide-react
線幅は統一。
strokeWidth: 1.8〜2

アイコンサイズ：
通常18〜20px。
5.10 プレゼン映えの注意
最重要。
1画面に詰め込みすぎない
スクロールしなくても、
- 推奨シナリオ
- 家族
- 進捗
- 次のアクション
の主要価値が見えること。
数字を大きく
例：
46%
4件
B案

推奨は明確に強調
B案カードには、
推奨

Badge＋青Border。
空画面を作らない
全画面サンプルデータ入り。
「SaaSのテンプレ」に見せすぎない
Family Move Support固有の要素、
- 家族プロフィール
- Must / Want
- 家族合意
- シナリオ
- Replan
を必ず使う。
6. デモ用データ
家族
const demoFamily = {
  id: "family-sato",
  name: "佐藤様ご家族",

  employee: {
    name: "佐藤 健太",
    age: 34,
    currentLocation: "東京都",
    destination: "大阪・梅田",
    transferDate: "2026-10-26",
  },

  spouse: {
    name: "佐藤 美咲",
    age: 32,
    employment: "正社員",
    companyLocation: "東京",
    wantsToContinueWorking: true,
    transferStatus: "unknown",
    remoteStatus: "unavailable",
  },

  child: {
    name: "佐藤 陽菜",
    age: 3,
    currentChildcare: "東京都内の認可保育園",
    newChildcareStatus: "unknown",
  },

  currentHousing: {
    type: "賃貸マンション",
    location: "東京都",
  },

  preferredDestination: "兵庫県西宮市",
};

優先順位
const priorities = {
  liveTogether: 5,
  spouseCareer: 5,
  childStability: 5,
  costSensitivity: 3,
  moveSpeed: 3,
};

条件
const conditions = {
  spouseTransfer: "unknown",
  remoteWork: "unavailable",
  childcareAvailability: "unknown",
  caregiving: false,
  ownedHome: false,
};

シナリオ
const scenarios = [
  {
    id: "A",
    title: "家族全員で早期に西宮へ転居",
    shortTitle: "家族全員で早期転居",
  },
  {
    id: "B",
    title: "夫が先に大阪へ着任し、妻子は後日合流",
    shortTitle: "夫先行 → 後日合流",
  },
  {
    id: "C",
    title: "一定期間の単身赴任",
    shortTitle: "一定期間の単身赴任",
  },
];

タスク
const initialTasks = [
  {
    id: 1,
    title: "妻の勤務先に関西異動可否を確認",
    owner: "妻",
    due: "10/12",
    status: "in_progress",
  },
  {
    id: 2,
    title: "西宮周辺の住居候補を比較",
    owner: "JTBコンシェルジュ",
    due: "10/13",
    status: "in_progress",
  },
  {
    id: 3,
    title: "保育園の申請条件を整理",
    owner: "JTBコンシェルジュ",
    due: "10/14",
    status: "todo",
  },
  {
    id: 4,
    title: "夫の一時住居候補を確認",
    owner: "JTBコンシェルジュ",
    due: "10/15",
    status: "todo",
  },
  {
    id: 5,
    title: "次回家族面談",
    owner: "ご家族＋JTB",
    due: "10/16",
    status: "todo",
  },
];

7. 簡易ロジック
7.1 シナリオスコア
複雑なAIは使用しない。
フロントエンドのみで計算。
各シナリオについて5段階評価を持つ。
Base Score
const scenarioBaseScores = {
  A: {
    liveTogether: 5,
    spouseCareer: 3,
    childStability: 3,
    costSensitivity: 3,
    moveSpeed: 3,
  },

  B: {
    liveTogether: 3,
    spouseCareer: 4,
    childStability: 5,
    costSensitivity: 2,
    moveSpeed: 5,
  },

  C: {
    liveTogether: 1,
    spouseCareer: 5,
    childStability: 5,
    costSensitivity: 3,
    moveSpeed: 5,
  },
};

条件補正
妻の関西異動が可能
A:
spouseCareer +1.5
moveSpeed +1

妻の関西異動が不可
A:
spouseCareer -2

フルリモート可能
A:
spouseCareer +1

保育園見込み「高」
A:
childStability +1.5

保育園見込み「低」
A:
childStability -1.5

全スコアは1〜5へclampする。
適合度
weighted =
  scenario.liveTogether * priorities.liveTogether +
  scenario.spouseCareer * priorities.spouseCareer +
  scenario.childStability * priorities.childStability +
  scenario.costSensitivity * priorities.costSensitivity +
  scenario.moveSpeed * priorities.moveSpeed

maxScore =
  5 *
  (
    priorities.liveTogether +
    priorities.spouseCareer +
    priorities.childStability +
    priorities.costSensitivity +
    priorities.moveSpeed
  )

fitScore = Math.round((weighted / maxScore) * 100)

最大スコアのシナリオを推奨とする。
7.2 初期状態
初期状態では、
B案が推奨

になること。
目安：
A ≒ 69
B ≒ 79
C ≒ 77

完全一致でなくてもよい。
7.3 Replanデモ
以下に変更：
妻の関西異動
possible

保育園見込み
high

すると、
A案

が推奨になること。
7.4 Plan Version
初期：
v1

Replanを実行：
v2

さらに実行：
v3

LocalStorage保存。
7.5 進捗率
タスク完了割合をそのまま使わず、デモとして見栄えよくする。
初期：
46%

各タスク完了で、
+8%

最大：
90%

Transition Completeを押した場合のみ100%。
7.6 推奨理由
完全自動生成不要。
シナリオごとに固定文を用意。
A
家族が早期に同居でき、配偶者の就業継続と保育環境の見通しも立っているため。

B
着任期限を守りながら、配偶者の仕事と子どもの生活を急激に変えずに済むため。

C
配偶者の仕事と子どもの現在の生活を最も維持しやすいため。

8. 技術構成
必須
React
Vite
TypeScript
Tailwind CSS
Lucide React

推奨Node：
Node.js 20+

原則追加しない
以下はなくてもよい。
- Redux
- Zustand
- React Query
- Axios
- Material UI
- Chakra
- shadcn/ui
- Framer Motion
- chartライブラリ
状態管理はReactの、
useState
useMemo
useContext

程度で十分。
Routing
React Routerは必須ではない。
最速実装を優先し、
type View =
  | "dashboard"
  | "check"
  | "scenarios"
  | "plan"
  | "tasks";

のようなstateで切り替えてよい。
URL Routingを追加してもよいが、デモ品質向上につながらないなら不要。
9. ディレクトリ・コンポーネント案
family-move-support/
│
├─ public/
│
├─ src/
│  │
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ index.css
│  │
│  ├─ data/
│  │  └─ demoData.ts
│  │
│  ├─ lib/
│  │  ├─ recommendation.ts
│  │  ├─ storage.ts
│  │  └─ helpers.ts
│  │
│  ├─ context/
│  │  └─ DemoContext.tsx
│  │
│  ├─ components/
│  │  │
│  │  ├─ layout/
│  │  │  ├─ AppShell.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  └─ Header.tsx
│  │  │
│  │  ├─ ui/
│  │  │  ├─ Card.tsx
│  │  │  ├─ Button.tsx
│  │  │  ├─ Badge.tsx
│  │  │  ├─ ProgressBar.tsx
│  │  │  ├─ Modal.tsx
│  │  │  └─ SectionHeader.tsx
│  │  │
│  │  ├─ family/
│  │  │  ├─ FamilyProfile.tsx
│  │  │  ├─ PriorityCard.tsx
│  │  │  └─ ConditionCard.tsx
│  │  │
│  │  ├─ scenario/
│  │  │  ├─ ScenarioCard.tsx
│  │  │  ├─ ScenarioComparison.tsx
│  │  │  └─ ReplanModal.tsx
│  │  │
│  │  ├─ plan/
│  │  │  ├─ PlanSummary.tsx
│  │  │  ├─ PlanPriorities.tsx
│  │  │  └─ PlanHistory.tsx
│  │  │
│  │  ├─ tasks/
│  │  │  └─ TaskList.tsx
│  │  │
│  │  └─ concierge/
│  │     └─ ConciergeDrawer.tsx
│  │
│  └─ views/
│     ├─ DashboardView.tsx
│     ├─ FamilyCheckView.tsx
│     ├─ ScenarioView.tsx
│     ├─ PlanView.tsx
│     └─ TasksView.tsx
│
├─ package.json
├─ tailwind.config.js
├─ vite.config.ts
└─ README.md

ファイル数を増やしすぎる必要はない。
AIエージェントがよりシンプルな構造を選ぶ場合は許容する。
10. 状態管理
以下をContextで一元管理推奨。
interface DemoState {
  family: Family;
  priorities: Priorities;
  conditions: Conditions;

  tasks: Task[];

  recommendedScenarioId: "A" | "B" | "C";

  scenarioScores: {
    A: number;
    B: number;
    C: number;
  };

  planVersion: number;

  progress: number;

  conciergeOpen: boolean;
}

LocalStorage Key：
family-move-support-demo-v1

11. 初期表示時の重要ルール
デモ用途のため、
空の状態から開始してはいけない。
初回アクセス時から必ず、
- 家族データ
- シナリオ
- タスク
- Plan
- メッセージ
を表示。
ユーザー登録画面も出さない。
ログインも不要。
URLを開いた瞬間から、
完成されたFamily Move Support

が見えること。
12. デモ操作で絶対に壊れてはいけないこと
以下を優先してテストする。
1
Dashboard
→ シナリオ比較
が動く。
2
Replan Modalを開ける。
3
条件変更で推奨が変わる。
4
Family Move Planのバージョンが上がる。
5
タスクを完了できる。
6
進捗率が変わる。
7
ページ更新してもLocalStorageから復元される。
8
「デモを初期状態に戻す」で完全復元できる。
13. プレゼン向けマイクロコピー
画面内で適宜使用する。
Family Move Check
まだ決まっていなくても大丈夫です。
未確定の条件も含めて、一緒に整理していきます。

シナリオ比較
答えを選ぶ前に、選択肢を見える化する。

Replan
家族の状況が変わったら、Planも変えていい。

Plan
家族全員の「大切にしたいこと」を、一つの計画へ。

Tasks
本人でなくても進められることは、JTBが先回りします。

Transition Complete
「次に何をすればいいか分からない」をなくす。

14. 実装の優先順位
時間が不足した場合は必ずこの順番で完成させる。
Priority 1
- AppShell
- Sidebar
- Dashboard
- デモデータ
Priority 2
- Scenario Comparison
- Recommendation Logic
- Replan Modal
Priority 3
- Family Move Plan
Priority 4
- Tasks
- LocalStorage
Priority 5
- Family Move Check
Priority 6
- Concierge Drawer
- Toast
- Animation
- Mobile調整
つまり、最悪時間が足りなくても、
Dashboard → Scenario Comparison → Replan → Plan

の4画面だけは高品質に完成させる。
15. 完成条件
以下をすべて満たせばMVP完成とする。
見た目
- [ ] 1440×900で崩れない
- [ ] 法人向けSaaSとして違和感のないデザイン
- [ ] 白＋ブルー基調
- [ ] 情報量は多いが整理されている
- [ ] サンプルデータが全画面に表示される
- [ ] 初見でも「引越しアプリ」ではないことが分かる
- [ ] 推奨シナリオが視覚的に分かる
- [ ] JTBコンシェルジュの伴走感が見える
操作
- [ ] Dashboardから各画面に移動できる
- [ ] Family Move Checkの値を変更できる
- [ ] A/B/Cシナリオを比較できる
- [ ] 初期状態でB案が推奨される
- [ ] Replan Modalを開ける
- [ ] 妻の異動可能＋保育見込み高でA案推奨に変わる
- [ ] Plan Versionが更新される
- [ ] タスクを完了できる
- [ ] 進捗率が更新される
- [ ] LocalStorageに保存される
- [ ] デモリセットが機能する
技術
- [ ] npm install が成功する
- [ ] npm run dev で起動する
- [ ] Console Errorがない
- [ ] npm run build が成功する
- [ ] APIキー不要
- [ ] バックエンド不要
- [ ] ネット接続がなくても主要画面が動く
16. AIコーディングエージェントへの最終指示
この仕様に曖昧な部分があっても、追加質問は行わず以下の優先順位で合理的に補完すること。
1. プレゼン時の見た目
2. サービス価値の伝わりやすさ
3. デモ操作の安定性
4. 実装の単純さ
5. 本番向けの技術的正しさ

本番サービスではないため、将来的な拡張性のための抽象化・複雑な設計は不要。
特に避けること：
・バックエンドを追加する
・不要な認証を作る
・DBを作る
・大量の依存ライブラリを追加する
・機能を増やしてUI品質を落とす
・管理画面を作り込む
・空状態やローディング画面に時間をかける

このMVPで最も重要なのは、
「条件が変わると、家族全体の推奨Planが変わる」

という体験。
デモ終了時に視聴者が、
「なるほど、引越し手配じゃなくて、転勤した家族がどう暮らすかを決めるサービスなのか」

と理解できれば成功とする。