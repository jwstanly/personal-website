const { DEBUG_MODE } = process.env;

export default function shouldLog(): boolean {
  return typeof DEBUG_MODE === 'boolean' && DEBUG_MODE;
}
