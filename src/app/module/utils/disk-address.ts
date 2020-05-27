/**
 * 将 10 进制地址转换成 8bit 16 进制区块地址
 * @param address 原始地址
 * @param splitBlock 转换后的地址，默认为 十进制 256，十六进制 FF
 */
export const address2block = (
  address: number = 0,
  partition: number = 1 << 8
): number[] => {
  let length = Math.floor(Math.log(address) / Math.log(partition));
  let arr: number[] = [];
  for (let i = length; i >= 0; i--) {
    if (i <= 0) {
      arr.push(address);
    } else {
      let div = Math.floor(address / Math.pow(partition, i));
      address = address % Math.pow(partition, i);
      arr.push(div);
    }
  }
  return arr;
};

/**
 * 将 8bit 16 进制区块地址转换成 10 进制地址
 * @param address
 * @param partition
 */
export const block2address = (address: number[], partition: number = 1 << 8) => {
  let result = 0;
  for (let i = 0; i < address.length; i++) {
    if (i === address.length) {
      result = result + address[i];
    } else {
      let cursor = address.length - 1 - i;
      result = result + Math.pow(partition, cursor) * (address[i]);
    }
  }
  return result;
};
