import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string;
}

export function PokemonDex({ onBack }: { onBack: () => void }) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPokemons = async (currentPage: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('gdash_token');
      console.log("DEUBG: Token sendo enviado:", token);
      const response = await axios.get(`http://localhost:3000/api/pokemon?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPokemons(response.data);
    } catch (error) {
      console.error("Erro ao buscar pokemons", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">Pokédex Integração</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Anterior
            </Button>
            <span className="text-sm font-bold">Pág {page}</span>
            <Button 
              variant="outline" 
              onClick={() => setPage(p => p + 1)}
              disabled={loading}
            >
              Próxima
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pokemons.map((poke) => (
              <Card key={poke.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex flex-col items-center">
                  <img src={poke.image} alt={poke.name} className="w-24 h-24 object-contain" />
                  <h3 className="text-lg font-bold capitalize mt-2">{poke.name}</h3>
                  <Badge variant="secondary" className="mt-1">{poke.types}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}