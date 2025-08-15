import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Search, Filter, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { JobFiltersComponent } from "@/components/JobFilters";
import { Job, JobFilters } from "@/types/job";

// Mock data - gerçek uygulamada API'den gelecek
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer - React/TypeScript",
    company: "TechCorp International",
    location: "Remote - Dünya Geneli",
    description: "React ve TypeScript ile modern web uygulamaları geliştirme deneyimi olan, kullanıcı deneyimini önemseyen geliştiriciler arıyoruz. Esnek çalışma saatleri ve uluslararası projeler.",
    salary: "$4000 - $7000",
    language: "both",
    diploma_required: false,
    source: "RemoteOK",
    apply_url: "https://example.com/apply",
    published_date: "2024-01-15",
    tags: ["React", "TypeScript", "Frontend"],
    sector: "technology"
  },
  {
    id: "2",
    title: "UI/UX Tasarımcı",
    company: "Design Studio",
    location: "Remote - Türkiye",
    description: "Kullanıcı deneyimi odaklı, yaratıcı ve yenilikçi tasarımlar yapan UI/UX tasarımcı arayışındayız. Figma ve Adobe Creative Suite deneyimi şartı.",
    language: "tr",
    diploma_required: false,
    source: "Kariyer.net",
    apply_url: "https://example.com/apply",
    published_date: "2024-01-14",
    tags: ["UI/UX", "Figma", "Design"],
    sector: "design"
  },
  {
    id: "3",
    title: "Python Backend Developer",
    company: "DataTech Solutions",
    location: "Remote - Global",
    description: "Python ve Django framework kullanarak backend sistemler geliştiren, API tasarımı konusunda deneyimli geliştiriciler arıyoruz.",
    language: "en",
    diploma_required: true,
    source: "WeWorkRemotely",
    apply_url: "https://example.com/apply",
    published_date: "2024-01-13",
    tags: ["Python", "Django", "Backend", "API"],
    sector: "technology"
  },
  {
    id: "4",
    title: "Dijital Pazarlama Uzmanı",
    company: "Marketing Pro",
    location: "Remote - EMEA",
    description: "SEO, SEM ve sosyal medya pazarlama konularında deneyimli, analitik düşünce yapısına sahip pazarlama uzmanı arıyoruz.",
    language: "both",
    diploma_required: false,
    source: "LinkedIn",
    apply_url: "https://example.com/apply",
    published_date: "2024-01-12",
    tags: ["SEO", "SEM", "Marketing", "Analytics"],
    sector: "marketing"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [filters, setFilters] = useState<JobFilters>({
    language: 'all',
    diploma_required: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const applyFilters = () => {
    let filtered = [...jobs];

    // Dil filtresi
    if (filters.language !== 'all') {
      filtered = filtered.filter(job => 
        filters.language === 'both' ? job.language === 'both' : job.language === filters.language || job.language === 'both'
      );
    }

    // Diploma şartı filtresi
    if (filters.diploma_required !== 'all') {
      filtered = filtered.filter(job => {
        if (filters.diploma_required === 'required') return job.diploma_required;
        if (filters.diploma_required === 'not_required') return !job.diploma_required;
        return true;
      });
    }

    // Sektör filtresi
    if (filters.sector) {
      filtered = filtered.filter(job => job.sector === filters.sector);
    }

    // Arama filtresi
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredJobs(filtered);
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handleFavorite = (jobId: string) => {
    setFavorites(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Freemote</h1>
                <p className="text-sm text-muted-foreground">Remote İş Fırsatları</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/favorites')}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Quick Search */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="İş ara..."
            value={filters.search || ''}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="flex-1"
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <JobFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
          />
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredJobs.length} iş ilanı bulundu
          </p>
          <div className="flex gap-2">
            <Button
              variant={filters.diploma_required === 'not_required' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({...filters, diploma_required: filters.diploma_required === 'not_required' ? 'all' : 'not_required'})}
            >
              Diploma Şartı Yok
            </Button>
          </div>
        </div>

        {/* Job List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">İş ilanı bulunamadı</h2>
            <p className="text-muted-foreground mb-6">
              Arama kriterlerinizi değiştirerek tekrar deneyin.
            </p>
            <Button onClick={() => setFilters({language: 'all', diploma_required: 'all', search: ''})}>
              Filtreleri Temizle
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isFavorite={favorites.includes(job.id)}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
