/* eslint-disable no-alert */
export function confirmation (question = 'Are you sure you want to trigger this action?') {
  return new Promise((resolve) => {
    resolve(Boolean(window.confirm(question)));
  });
}
