import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { useFavorites } from "@/hooks/useFavorites";

export const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, getFavoriteJobs } = useFavorites();
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteJobs = async () => {
      setLoading(true);
      const jobs = await getFavoriteJobs();
      setFavoriteJobs(jobs as Job[]);
      setLoading(false);
    };
    
    loadFavoriteJobs();
  }, [favorites]);

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
        {loading ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Favoriler yükleniyor...</h2>
          </div>
        ) : favoriteJobs.length === 0 ? (
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
              {favoriteJobs.length} favori iş ilanınız var
            </p>
            {favoriteJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isFavorite={true}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};