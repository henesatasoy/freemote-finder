import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { JobFilters } from "@/types/job";

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onSearch: () => void;
}

export const JobFiltersComponent = ({ filters, onFiltersChange, onSearch }: JobFiltersProps) => {
  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filtreler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Arama */}
        <div className="flex gap-2">
          <Input
            placeholder="İş pozisyonu, şirket adı veya anahtar kelime..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="flex-1"
          />
          <Button onClick={onSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Dil Filtresi */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Dil</label>
          <Select 
            value={filters.language} 
            onValueChange={(value) => handleFilterChange('language', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dil seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="tr">Türkçe</SelectItem>
              <SelectItem value="en">İngilizce</SelectItem>
              <SelectItem value="both">Her İkisi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Diploma Şartı Filtresi */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Diploma Şartı</label>
          <Select 
            value={filters.diploma_required} 
            onValueChange={(value) => handleFilterChange('diploma_required', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Diploma şartı seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="not_required">Diploma Şartı Olmayanlar</SelectItem>
              <SelectItem value="required">Diploma Şartı Olanlar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sektör Filtresi */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sektör</label>
          <Select 
            value={filters.sector || ''} 
            onValueChange={(value) => handleFilterChange('sector', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sektör seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tümü</SelectItem>
              <SelectItem value="technology">Teknoloji</SelectItem>
              <SelectItem value="design">Tasarım</SelectItem>
              <SelectItem value="marketing">Pazarlama</SelectItem>
              <SelectItem value="finance">Finans</SelectItem>
              <SelectItem value="sales">Satış</SelectItem>
              <SelectItem value="customer-service">Müşteri Hizmetleri</SelectItem>
              <SelectItem value="content">İçerik</SelectItem>
              <SelectItem value="operations">Operasyon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};