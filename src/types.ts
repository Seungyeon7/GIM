export interface Question {
    id: number;
    name: string;
    content: string;
    image: string | null;
}

export interface Record {
    date: string;
    questions: Question[];
    instantQuestions: Question[];
    transcript: string;
    planningTime: string;
    interviewTime: string;
    questionTimes: { [key: string]: number };
}

export type PageType = 'home' | 'conceptual-list' | 'instant-list' | 'interview' | 'records';

export interface StorageUsage {
    usedKB: string;
    maxKB: number;
    percentage: string;
}
