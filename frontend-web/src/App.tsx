import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Wind, Droplets, Thermometer, BrainCircuit, LogOut, Gamepad2 } from 'lucide-react';
import type { WeatherData } from './types/weather';
import { format } from 'date-fns';
import { Login } from './Login';
import { PokemonDex } from './PokemonDex'; 

const API_URL = 'http://localhost:3000/api/weather';

function Dashboard({ onLogout, onNavigate }: { onLogout: () => void, onNavigate: () => void }) {
  const [data, setData] = useState<WeatherData[]>([]);
  const [latest, setLatest] = useState<WeatherData | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<WeatherData[]>(API_URL);
      const sortedData = response.data;
      setData(sortedData);
      if (sortedData.length > 0) setLatest(sortedData[0]);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [...data].reverse().map(item => ({
    time: item.createdAt ? format(new Date(item.createdAt), 'HH:mm') : '00:00',
    temp: item.temperature
  }));

  const handleExportCSV = () => {
    window.open(`${API_URL}/export/csv`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
             <h1 className="text-3xl font-bold text-slate-800">🌥️ G-Dash Weather</h1>
             <Badge variant="outline" className="text-lg px-4 py-1">{latest?.city || "Goiânia"}</Badge>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button variant="outline" onClick={onNavigate}>
              <Gamepad2 className="mr-2 h-4 w-4" /> API Pública
            </Button>
            <Button variant="destructive" onClick={onLogout} size="sm">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        {/* Cards de Status */}
        {latest && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
                <Thermometer className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{latest.temperature}°C</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Umidade</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{latest.humidity}%</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vento</CardTitle>
                <Wind className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{latest.wind_speed} km/h</div></CardContent>
            </Card>
            <Card className="bg-indigo-50 border-indigo-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-700">Insight IA</CardTitle>
                <BrainCircuit className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent><p className="text-sm text-indigo-800 font-medium leading-tight">{latest.ai_insight}</p></CardContent>
            </Card>
          </div>
        )}

        {/* Gráfico */}
        {data.length > 0 && (
          <Card className="col-span-4">
            <CardHeader><CardTitle>Histórico de Temperatura</CardTitle></CardHeader>
            <CardContent className="pl-2">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°C`} />
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela */}
        {data.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Últimos Registros</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead>Temp (°C)</TableHead>
                    <TableHead>Umidade (%)</TableHead>
                    <TableHead>Insight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 5).map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.createdAt ? format(new Date(item.createdAt), 'dd/MM HH:mm') : '-'}</TableCell>
                      <TableCell>{item.temperature}°C</TableCell>
                      <TableCell>{item.humidity}%</TableCell>
                      <TableCell className="text-slate-500 italic">{item.ai_insight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('gdash_token'));
  const [view, setView] = useState<'dashboard' | 'pokemon'>('dashboard');

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('gdash_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('gdash_token');
    setToken(null);
    setView('dashboard');
  };

  if (!token) return <Login onLoginSuccess={handleLoginSuccess} />;

  if (view === 'pokemon') {
    return <PokemonDex onBack={() => setView('dashboard')} />;
  }

  return <Dashboard onLogout={handleLogout} onNavigate={() => setView('pokemon')} />;
}

export default App;