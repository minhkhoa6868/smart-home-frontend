export default function formatToDatetimeLocal(isoString: string): string {
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000; // Offset in ms
    const localISOTime = new Date(date.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16); // YYYY-MM-DDTHH:MM
    return localISOTime;
}