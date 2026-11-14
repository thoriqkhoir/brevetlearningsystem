export interface ExamReferenceItem {
    id?: string;
    title: string;
    url: string;
}

export interface CalcHistoryItem {
    id: string;
    expression: string;
    result: string;
    createdAt: string;
}

export interface CalculatorSessionState {
    expression: string;
    display: string;
    history: CalcHistoryItem[];
}

export interface NotesSessionState {
    content: string;
    updatedAt?: string;
}

export interface ExcelSessionState {
    version?: number;
    sheets?: any[];
    cells?: Record<string, string>;
    updatedAt?: string;
}

export interface ExamPanelsState {
    leftOpen: boolean;
    rightOpen: boolean;
}

export interface ExamActivePopupsState {
    calculator: boolean;
    notes: boolean;
    excel: boolean;
}

export interface QuestionIndexItem {
    id: string;
    order_no?: number;
}
