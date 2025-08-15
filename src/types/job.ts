export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  language: 'tr' | 'en' | 'both';
  diploma_required: boolean;
  source: string;
  apply_url: string;
  published_date: string;
  tags: string[];
  sector?: string;
}

export interface JobFilters {
  language: 'all' | 'tr' | 'en' | 'both';
  diploma_required: 'all' | 'required' | 'not_required';
  sector?: string;
  search?: string;
}