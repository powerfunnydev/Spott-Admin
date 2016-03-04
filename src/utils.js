/**
 * Helper function to pad zeros.
 */
export function zeroPad (num, places = 2) {
  const zero = places - num.toString().length + 1;
  return Array(zero > 0 ? zero : 0).join('0') + num;
}

export function fileSizeToString (size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(Number(size / Math.pow(1024, i)).toFixed(2))}${[ 'B', 'kB', 'MB', 'GB', 'TB' ][i]}`;
}
