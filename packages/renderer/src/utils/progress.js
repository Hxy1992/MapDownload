// 下载进度
let downloading = false; // 下载状态
const statistics = {success: 0, error: 0, percentage: 0, count: 0}; // 进度统计
let progressDom = null;
let successDom = null;
let errorDom = null;
let containerDom = null;
export function getState() {
  return downloading;
}
export function setState(val) {
  downloading = val;
  if (val) {
    setProgress({success: 0, error: 0, percentage: 0});
    showProgress(true);
  }
}
export function getProgress() {
  return statistics;
}
export function setProgress(val) {
  const {success, error, percentage, count} = val;
  if (typeof success !== 'undefined') statistics.success = success;
  if (typeof error !== 'undefined') statistics.error = error;
  if (typeof percentage !== 'undefined') statistics.percentage = percentage;
  if (typeof count !== 'undefined') statistics.count = count;
  updateProgress();
}
export function setProgressDom(val) {
  progressDom = val.progress;
  successDom = val.success;
  errorDom = val.error;
  containerDom = val.container;
}
export function showProgress(visible) {
  containerDom.style.display = visible ? 'block' : 'none';
}
function updateProgress() {
  progressDom.value = statistics.percentage;
  successDom.innerText = `${statistics.success}/${statistics.count}`;
  errorDom.innerText = statistics.error;
}
