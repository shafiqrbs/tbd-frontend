import dayjs from "dayjs";

export const formatDate = (dateString, format = "DD-MM-YYYY") => {
    if (!dateString) return "";
    return dayjs(dateString).format(format);
};

export const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-");
    return new Date(year, month - 1, day);
};