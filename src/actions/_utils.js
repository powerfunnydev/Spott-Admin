// DEPRECATED, used in media, for old upload video.
// REMOVE ME

export function createRecordStart (type) {
  return { type };
}
export function createRecordSuccess (type, records, args) {
  return { ...args, records, type };
}
export function createRecordError (type, error) {
  return { error, type };
}
