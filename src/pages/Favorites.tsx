import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";

// Mock favoriler data - gerçek uygulamada localStorage veya API'den gelecek
const mockFavorites: Job[] = [
  {
    id: "1",
    title: "Frontend Developer - React/TypeScript",
    company: "TechCorp International",
    location: "Remote - Dünya Geneli",
    description: "React ve TypeScript ile modern web uygulamaları geliştirme deneyimi olan, kullanıcı deneyimini önemseyen geliştiriciler arıyoruz.",
    salary: "$4000 - $7000",
    language: "both",
    diploma_required: false,
    source: "RemoteOK",
    apply_url: "https://example.com/apply",
    published_date: "2024-01-15",
    tags: ["React", "TypeScript", "Frontend"],
    sector: "technology"
  }
];

export const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Job[]>([]);

  useEffect(() => {
    // Gerçek uygulamada burada favoriler API'den veya localStorage'dan çekilecek
    setFavorites(mockFavorites);
  }, []);

  const handleRemoveFavorite = (jobId: string) => {
    setFavorites(favorites.filter(job => job.id !== jobId));
    // Gerçek uygulamada burada API'ye favorilerden çıkarma isteği gönderilecek
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Favorilerim
          </h1>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Henüz favori iş ilanınız yok</h2>
            <p className="text-muted-foreground mb-6">
              Beğendiğiniz iş ilanlarını favorilere ekleyerek daha sonra kolayca erişebilirsiniz.
            </p>
            <Button onClick={() => navigate('/')}>
              İş İlanlarını Keşfet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground mb-4">
              {favorites.length} favori iş ilanınız var
            </p>
            {favorites.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isFavorite={true}
                onFavorite={handleRemoveFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};