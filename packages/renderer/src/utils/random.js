// 随机数 + 唯一id

/**
  * 生成唯一id
  */
export function uuid() {
  const temp_url = URL.createObjectURL(new Blob());
  const temp_uuid = temp_url.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
  URL.revokeObjectURL(temp_uuid);
  return temp_uuid.substr(temp_uuid.lastIndexOf('/') + 1);
}
