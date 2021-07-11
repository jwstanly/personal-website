import shouldLog from './shouldLog';

export default function logInput(input: any): void {
  if (shouldLog()) {
    console.log('Received:', input);
  }
}
