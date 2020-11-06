/**
 * @param {string} created_at Feedを作成した時間、文字列になっている
 * @return {number} ミリ秒の時間を返す。
 */
function getDeltaTimeMiliSec(created_at: string): number {
  return new Date().getTime() - new Date(created_at).getTime();
}

/**
 * @param {number} miliSec ミリ秒
 * @return {number} 1000で割って秒に変換した値を返す
 */
function getSecFromMiliSec(miliSec: number): number {
  return Math.floor(miliSec / 1000);
}

/**
 * @param {string} created_at Feedを作成した時間、文字列になっている
 * @return {number} 時間の差を1000で割って秒に変換した値を返す
 */
function getDeltaSec(created_at: string): number {
  const deltaMiliSec = getDeltaTimeMiliSec(created_at);
  return getSecFromMiliSec(deltaMiliSec);
}

/**
 * @param {nubmer} deltaTimeSec 現在の時間から、フィードを作成した時間の差
 * @return {string} フィードに表示するメッセージを返す
 */
function getTimeMessage(deltaTimeSec: number): string {
  if (deltaTimeSec < 60) {
    return `${deltaTimeSec}秒前`;
  } else if (deltaTimeSec < 60 * 60) {
    return `${Math.floor(deltaTimeSec / 60)}分前`;
  } else if (deltaTimeSec < 60 * 60 * 24) {
    return `${Math.floor(deltaTimeSec / 60 / 60)}時間前`;
  } else {
    return `${Math.floor(deltaTimeSec / 60 / 60 / 24)}日前`;
  }
}

/**
 * @param {string} created_at Feedを作成した時間、文字列になっている
 * @return {string} フィードに表示される文字を表示
 */
export function getDeltaTimeMessage(created_at: string): string {
  const deltaTimeSec: number = getDeltaSec(created_at);

  return getTimeMessage(deltaTimeSec);
}
