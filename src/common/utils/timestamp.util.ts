interface ProtoTimestamp {
  seconds: number | string;
  nanos: number;
}

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
