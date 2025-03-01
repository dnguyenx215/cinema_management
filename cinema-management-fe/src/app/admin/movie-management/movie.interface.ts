export interface Movie {
    id: number;
    title: string;
    description: string;
    duration: number;
    posterUrl?: string;
    trailerUrl?: string;
    categories?: string[];
    status?: 'now-showing' | 'coming-soon';
  }