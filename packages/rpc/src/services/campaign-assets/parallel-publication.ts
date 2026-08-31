export async function prepareInParallel<Input, Prepared>({
  items,
  prepare,
  compensate,
}: {
  items: Input[];
  prepare: (item: Input, index: number, record: (prepared: Prepared) => void) => Promise<void>;
  compensate: (prepared: Prepared[]) => Promise<void>;
}) {
  const preparedByIndex: Array<Prepared | undefined> = Array(items.length);
  const results = await Promise.allSettled(
    items.map((item, index) =>
      prepare(item, index, (prepared) => {
        preparedByIndex[index] = prepared;
      }),
    ),
  );
  const prepared = preparedByIndex.filter((asset): asset is Prepared => asset !== undefined);
  const failed = results.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );

  if (failed) {
    await compensate(prepared);
    throw failed.reason;
  }

  return prepared;
}
