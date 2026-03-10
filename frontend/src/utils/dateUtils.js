import { format, parseISO, differenceInDays, isPast, isToday, isFuture } from 'date-fns';

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(parseISO(dateString), 'dd/MM/yyyy');
};

export const getDaysRemaining = (dateString) => {
    if (!dateString) return 0;
    const examDate = parseISO(dateString);
    const now = new Date();
    // Reset time for accurate day calculation
    examDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return differenceInDays(examDate, now);
};

export const isExamUpcoming = (dateString) => {
    if (!dateString) return false;
    const examDate = parseISO(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);
    return examDate > now || isToday(examDate);
};
