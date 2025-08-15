import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Search, Filter, Briefcase, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { JobFiltersComponent } from "@/components/JobFilters";
import { JobFilters } from "@/types/job";
import { useJobs } from "@/hooks/useJobs";
import { useFavorites } from "@/hooks/useFavorites";
import { JobScraperService } from "@/services/jobScraper";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { jobs, loading, error, searchJobs, fetchJobs } = useJobs();
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [filters, setFilters] = useState<JobFilters>({
    language: 'all',
    diploma_required: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    if (filters.search || filters.language !== 'all' || filters.diploma_required !== 'all' || filters.sector) {
      searchJobs(filters);
    }
  }, [filters]);

  const handleSearch = () => {
    searchJobs(filters);
  };

  const handleRefreshJobs = async () => {
    setScraping(true);
    try {
      await JobScraperService.scrapeAllJobs();
      await fetchJobs();
      toast({
        title: "İş ilanları güncellendi",
        description: "Yeni iş ilanları başarıyla yüklendi."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "İş ilanları güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setScraping(false);
    }
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefreshJobs}
                disabled={scraping}
              >
                <RefreshCw className={`h-5 w-5 ${scraping ? 'animate-spin' : ''}`} />
              </Button>
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
            {loading ? 'Yükleniyor...' : error ? 'Hata oluştu' : `${jobs.length} iş ilanı bulundu`}
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
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">İş ilanları yükleniyor...</h2>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Hata oluştu</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchJobs}>Tekrar Dene</Button>
          </div>
        ) : jobs.length === 0 ? (
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
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isFavorite={favorites.includes(job.id)}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
