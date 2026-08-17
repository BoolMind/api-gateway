interface ProtoTimestamp {
  seconds: number | string;
  nanos: number;
}

/**
 * ts-proto's exact numeric type for int64 `seconds` depends on generator
 * options (plain number vs string), so this accepts either defensively.
 */
export function grpcTimestampToIso(
  timestamp: ProtoTimestamp | undefined,
): string | undefined {
  if (!timestamp) {
    return undefined;
  }

  const seconds =
    typeof timestamp.seconds === 'string'
      ? Number(timestamp.seconds)
      : timestamp.seconds;

  const millis = seconds * 1000 + Math.floor((timestamp.nanos ?? 0) / 1e6);

  return new Date(millis).toISOString();
}
