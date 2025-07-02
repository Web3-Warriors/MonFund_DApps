import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Calendar, Target } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CROWDFUNDING_CONTRACT_ADDRESS, CROWDFUNDING_ABI, Program } from '@/config/contract';
import { Link } from 'react-router-dom';

const MyContributions = () => {
  const { address, isConnected } = useAccount();
  const [contributedPrograms, setContributedPrograms] = useState<Program[]>([]);
  const [totalContributed, setTotalContributed] = useState<bigint>(BigInt(0));

  // Read all programs
  const { data: programIds } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getListProgramId',
  });

  // Effect to fetch contribution data
  useEffect(() => {
    const fetchContributions = async () => {
      if (!address || !programIds) return;

      const programs: Program[] = [];
      let total = BigInt(0);

      for (const programId of programIds) {
        try {
          // Get program details
          const programData = await fetch(`/api/program/${programId}`).catch(() => null);
          
          // For now, we'll simulate this as we need to query events or contribution history
          // In a real implementation, you'd want to:
          // 1. Query contract events for ContributionReceived with user's address
          // 2. Or maintain a separate backend/subgraph for this data
          
          // This is a simplified version - you'd need to implement proper event querying
          console.log(`Checking contributions for program ${programId}`);
        } catch (error) {
          console.error('Error fetching contribution data:', error);
        }
      }

      setContributedPrograms(programs);
      setTotalContributed(total);
    };

    fetchContributions();
  }, [address, programIds]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-space-grotesk text-2xl font-bold mb-2">
              Wallet Tidak Terhubung
            </h2>
            <p className="text-muted-foreground mb-6">
              Hubungkan wallet Anda untuk melihat riwayat kontribusi
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-space-grotesk text-4xl font-bold mb-4">
            Kontribusi Saya
          </h1>
          <p className="text-muted-foreground text-lg">
            Lihat semua program yang telah Anda dukung dan dampaknya
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {contributedPrograms.length}
              </div>
              <div className="text-muted-foreground">Program Didukung</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {parseFloat(formatEther(totalContributed)).toFixed(4)}
              </div>
              <div className="text-muted-foreground">Total Kontribusi (ETH)</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-info mb-2">
                {contributedPrograms.filter(p => p.status === 1).length}
              </div>
              <div className="text-muted-foreground">Program Berhasil</div>
            </CardContent>
          </Card>
        </div>

        {/* Contributions List */}
        {contributedPrograms.length > 0 ? (
          <div className="space-y-6">
            <h2 className="font-space-grotesk text-2xl font-semibold">
              Program yang Didukung
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contributedPrograms.map((program) => {
                const progress = Number(program.totalAmount) / Number(program.targetFund) * 100;
                
                return (
                  <Card key={program.id.toString()} className="group hover:shadow-card transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="font-space-grotesk text-lg line-clamp-2">
                          {program.title}
                        </CardTitle>
                        <Badge variant={program.status === 1 ? "secondary" : "outline"} className="ml-2">
                          {program.status === 1 ? "Selesai" : "Aktif"}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-4">
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {program.desc}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{parseFloat(formatEther(program.totalAmount)).toFixed(4)} ETH</span>
                            <span>dari {parseFloat(formatEther(program.targetFund)).toFixed(4)} ETH</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(Number(program.endDate) * 1000).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          {/* You would show contribution amount here if available */}
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-primary" />
                            <span>0.001 ETH</span>
                          </div>
                        </div>
                        
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/program/${program.id}`}>
                            Lihat Detail
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-space-grotesk text-xl font-semibold mb-2">
              Belum Ada Kontribusi
            </h3>
            <p className="text-muted-foreground mb-6">
              Mulai dukung program-program menarik di kampus dan buat dampak positif!
            </p>
            <Button variant="hero" asChild>
              <Link to="/programs">
                <TrendingUp className="w-4 h-4 mr-2" />
                Jelajahi Program
              </Link>
            </Button>
          </div>
        )}

        {/* Impact Section */}
        {contributedPrograms.length > 0 && (
          <Card className="mt-12 bg-gradient-primary p-8 border-0">
            <CardContent className="p-0 text-center">
              <h2 className="font-space-grotesk text-2xl font-bold text-primary-foreground mb-4">
                Terima Kasih!
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-6">
                Kontribusi Anda telah membantu mewujudkan {contributedPrograms.length} program di kampus
              </p>
              <div className="flex justify-center space-x-8 text-primary-foreground">
                <div className="text-center">
                  <div className="text-2xl font-bold">{contributedPrograms.length}</div>
                  <div className="text-sm opacity-80">Program</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {parseFloat(formatEther(totalContributed)).toFixed(2)}
                  </div>
                  <div className="text-sm opacity-80">ETH Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">∞</div>
                  <div className="text-sm opacity-80">Dampak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyContributions;