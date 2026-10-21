export const formatDateTime = (value: Date | null) => {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    }).format(value);
};
