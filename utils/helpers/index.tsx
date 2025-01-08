export function formatPhoneNumber(phone: string) {
    const cleaned = phone.replace(/\D/g, ""); 
    const limited = cleaned.slice(0, 10);
    const match = limited.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return limited;
    const [, area, prefix, line] = match;
    return [area, prefix, line].filter(Boolean).join(" ");
};