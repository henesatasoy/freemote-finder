import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, MapPin, Calendar, Building, Heart } from "lucide-react";
import { Job } from "@/types/job";
import { useState, useEffect } from "react";

// Mock data - gerçek uygulamada API'den gelecek
const mockJob: Job = {
  id: "1",
  title: "Frontend Developer - React/TypeScript",
  company: "TechCorp International",
  location: "Remote - Dünya Geneli",
  description: `Dinamik ve yenilikçi ekibimize katılacak deneyimli bir Frontend Developer arıyoruz. 

React ve TypeScript ile modern web uygulamaları geliştirme deneyimi olan, kullanıcı deneyimini önemseyen ve sürekli öğrenmeye açık geliştiricilerle çalışmak istiyoruz.

Sorumluluklar:
• React ve TypeScript kullanarak modern web uygulamaları geliştirmek
• Responsive ve kullanıcı dostu arayüzler tasarlamak
• API entegrasyonları yapmak
• Kod kalitesini artırmak için code review süreçlerine katılmak
• Agile metodolojiler çerçevesinde çalışmak

Gereksinimler:
• 3+ yıl React deneyimi
• TypeScript bilgisi
• Modern CSS/SCSS kullanımı
• Git versiyon kontrol sistemi bilgisi
• İngilizce iletişim becerisi
• Takım çalışmasına yatkın olmak

Avantajlar:
• Tamamen remote çalışma imkanı
• Esnek çalışma saatleri
• Uluslararası projeler
• Sürekli öğrenme fırsatları
• Rekabetçi maaş`,
  salary: "$4000 - $7000",
  language: "both",
  diploma_required: false,
  source: "RemoteOK",
  apply_url: "https://example.com/apply",
  published_date: "2024-01-15",
  tags: ["React", "TypeScript", "Frontend", "Remote", "JavaScript"],
  sector: "technology"
};

export const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Gerçek uygulamada burada API'den iş detayı çekilecek
    setJob(mockJob);
  }, [id]);

  const handleApply = () => {
    if (job?.apply_url) {
      window.open(job.apply_url, '_blank');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Gerçek uygulamada burada API'ye favorite durumu gönderilecek
  };

  const getLanguageBadge = (language: string) => {
    switch (language) {
      case 'tr': return 'Türkçe';
      case 'en': return 'English';
      case 'both': return 'TR/EN';
      default: return language;
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">İş ilanı yükleniyor...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold">İş İlanı Detayı</h1>
        </div>

        {/* Job Header Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                <div className="flex items-center gap-2 text-lg text-muted-foreground mb-4">
                  <Building className="h-5 w-5" />
                  <span>{job.company}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    {getLanguageBadge(job.language)}
                  </Badge>
                  <Badge 
                    variant={job.diploma_required ? "destructive" : "outline"}
                  >
                    {job.diploma_required ? 'Diploma Gerekli' : 'Diploma Şartı Yok'}
                  </Badge>
                  <Badge variant="outline">
                    {job.source}
                  </Badge>
                  {job.sector && (
                    <Badge variant="outline">
                      {job.sector}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Yayın: {new Date(job.published_date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {job.salary && (
                    <div className="font-medium text-primary">
                      {job.salary}
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className="ml-4"
              >
                <Heart 
                  className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Job Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>İş Açıklaması</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {job.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Etiketler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Apply Button */}
        <div className="sticky bottom-6">
          <Button 
            onClick={handleApply}
            className="w-full flex items-center gap-2 text-lg py-6"
            size="lg"
          >
            <ExternalLink className="h-5 w-5" />
            Bu İşe Başvur
          </Button>
        </div>
      </div>
    </div>
  );
};