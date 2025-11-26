export interface Scholarship {
    id: string;
    name: string;
    provider: string;
    amount: number;
    deadline: string;
    description: string;
    requirements: string[];
    region: string;
    url: string;
    categories?: string[];
}

export interface UserProfile {
    essay: string;
    region: string;
}
