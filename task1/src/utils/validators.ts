export function isValidUrl(value: string): boolean {
    if (!value || typeof value !== 'string') return false;
    // Allow URLs with or without protocol. If missing, prepend http:// for validation.
    const candidate = value.match(/^\w+:\/\//) ? value : `http://${value}`;
    try {
        // Use WHATWG URL constructor for robust parsing
        // eslint-disable-next-line no-new
        new URL(candidate);
        return true;
    } catch {
        return false;
    }
}