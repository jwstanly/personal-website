const { DEBUG_MODE } = process.env;

export default function shouldLog(): boolean {
  return typeof DEBUG_MODE === 'string' ? DEBUG_MODE === 'true' : DEBUG_MODE;
}
