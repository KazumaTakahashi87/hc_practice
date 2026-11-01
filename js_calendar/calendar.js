// cal コマンドと同じ見た目のカレンダーを表示するプログラム
// 使い方：
//   node calendar.js        … 今月のカレンダー
//   node calendar.js -m 6   … 今年の6月のカレンダー

const WEEK_HEADER = '日 月 火 水 木 金 土';
const CALENDAR_WIDTH = 20; // 7日分 × 2文字 + 区切りの空白6つ

// コマンドライン引数から表示する月を決める
function parseMonth(args, today) {
  const index = args.indexOf('-m');

  // -m がなければ今月
  if (index === -1) {
    return today.getMonth() + 1;
  }

  const value = args[index + 1];

  // -m のあとに月がない場合
  if (value === undefined) {
    throw new Error('option requires an argument -- m');
  }

  // 1〜12 の整数だけを正しい月とする
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 12) {
    throw new Error(`${value} is neither a month number (1..12) nor a name`);
  }

  return Number(value);
}

// 全角文字を2文字分として、表示上の幅を数える
function displayWidth(text) {
  let width = 0;
  for (const char of text) {
    width += char.charCodeAt(0) > 0xff ? 2 : 1;
  }
  return width;
}

// 「2月 2022」をカレンダーの幅の中央に置く
function buildTitle(year, month) {
  const title = `${month}月 ${year}`;
  const padding = Math.floor((CALENDAR_WIDTH - displayWidth(title)) / 2);
  return ' '.repeat(padding) + title;
}

// 日付の部分を1週間ずつの行にする
function buildWeeks(year, month) {
  // 月は0始まりなので month - 1 を渡す
  const firstDay = new Date(year, month - 1, 1);
  // 翌月の0日目 = その月の最終日
  const lastDate = new Date(year, month, 0).getDate();

  const weeks = [];
  // 1日の曜日の分だけ空白を入れる（0 = 日曜日）
  let week = Array(firstDay.getDay()).fill('  ');

  for (let date = 1; date <= lastDate; date++) {
    week.push(String(date).padStart(2, ' '));

    // 土曜日まで埋まったら次の行へ
    if (week.length === 7) {
      weeks.push(week.join(' '));
      week = [];
    }
  }

  // 最後の週が途中で終わった場合
  if (week.length > 0) {
    weeks.push(week.join(' '));
  }

  return weeks;
}

function main() {
  const today = new Date();
  const year = today.getFullYear();

  let month;
  try {
    month = parseMonth(process.argv.slice(2), today);
  } catch (error) {
    console.error(`calendar: ${error.message}`);
    process.exit(1);
  }

  console.log(buildTitle(year, month));
  console.log(WEEK_HEADER);
  for (const week of buildWeeks(year, month)) {
    console.log(week);
  }
}

main();
