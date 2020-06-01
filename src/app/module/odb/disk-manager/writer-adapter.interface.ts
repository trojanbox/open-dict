export interface WriterAdapterInterface {
  writeLnLazy(str: string);

  write(str: Buffer | string);

  done();
}
