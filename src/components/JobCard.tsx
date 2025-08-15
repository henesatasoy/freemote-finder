import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, MapPin, Calendar } from "lucide-react";
import { Job } from "@/types/job";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: Job;
  onFavorite?: (jobId: string) => void;
  isFavorite?: boolean;
}

export const JobCard = ({ job, onFavorite, isFavorite = false }: JobCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getLanguageBadge = (language: string) => {
    switch (language) {
      case 'tr': return 'Türkçe';
      case 'en': return 'English';
      case 'both': return 'TR/EN';
      default: return language;
    }
  };

  return (
    <Card className="w-full mb-4 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate(`/job/${job.id}`)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {job.company}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.(job.id);
            }}
            className="ml-2"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {getLanguageBadge(job.language)}
          </Badge>
          <Badge 
            variant={job.diploma_required ? "destructive" : "outline"}
            className="text-xs"
          >
            {job.diploma_required ? 'Diploma Gerekli' : 'Diploma Şartı Yok'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.source}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(job.published_date).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
        
        <p 
          className={`text-sm text-muted-foreground mb-3 ${!isExpanded ? 'line-clamp-3' : ''}`}
        >
          {job.description}
        </p>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-primary p-0 h-auto"
          >
            {isExpanded ? 'Daha Az Göster' : 'Devamını Oku'}
          </Button>
          
          <Button 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(job.apply_url, '_blank');
            }}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Başvur
          </Button>
        </div>
        
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {job.tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};