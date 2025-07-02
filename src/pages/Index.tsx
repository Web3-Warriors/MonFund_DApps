import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { ProgramCard } from "@/components/ProgramCard";
import { Coins, Heart, Target, Users, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useReadContract } from "wagmi";
import {
  CROWDFUNDING_CONTRACT_ADDRESS,
  CROWDFUNDING_ABI,
  Program,
} from "@/config/contract";
import { useIsOwner } from "@/hooks/useIsOwner";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const { isOwner } = useIsOwner();
  // Read all programs from contract
  const { data: programIds, isLoading: isLoadingIds } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getListProgramId",
  });

  // Get first few programs for preview
  const { data: program1 } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getProgramById",
    args: programIds && programIds.length > 0 ? [programIds[0]] : undefined,
  });

  const { data: program2 } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getProgramById",
    args: programIds && programIds.length > 1 ? [programIds[1]] : undefined,
  });

  const { data: program3 } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getProgramById",
    args: programIds && programIds.length > 2 ? [programIds[2]] : undefined,
  });

  const featuredPrograms = [program1, program2, program3].filter(
    Boolean
  ) as Program[];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 opacity-10">
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative container mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-primary/20 text-primary border-primary/30"
          >
            🚀 Platform Crowdfunding Kampus Berbasis Web3
          </Badge>

          <h1 className="font-space-grotesk text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            MonFund
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Wujudkan Impian Kampus dengan Teknologi Blockchain. Platform
            crowdfunding transparans untuk mendanai program-program inovatif di
            lingkungan kampus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="xl" variant="hero" asChild className="pulse-glow">
              <Link to="/programs">
                <Coins className="w-5 h-5 mr-2" />
                Jelajahi Program
              </Link>
            </Button>
            {isOwner && (
              <Button size="xl" variant="outline" asChild>
                <Link to="/create">
                  <Target className="w-5 h-5 mr-2" />
                  Buat Program Baru
                </Link>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {programIds?.length || 0}
                </div>
                <div className="text-muted-foreground">Program Aktif</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">100%</div>
                <div className="text-muted-foreground">Transparansi</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-info mb-2">∞</div>
                <div className="text-muted-foreground">Kemungkinan</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      {featuredPrograms.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-space-grotesk text-3xl font-bold mb-4">
                Program Unggulan
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Temukan program-program menarik yang sedang mencari dukungan
                dari komunitas kampus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredPrograms.map((program) => (
                <ProgramCard key={program.id.toString()} program={program} />
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <Link to="/programs">Lihat Semua Program</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-3xl font-bold mb-4">
              Mengapa MonFund?
            </h2>
            <p className="text-muted-foreground text-lg">
              Platform crowdfunding yang aman, transparan, dan mudah digunakan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-space-grotesk font-semibold text-lg mb-2">
                  Aman & Transparan
                </h3>
                <p className="text-muted-foreground">
                  Semua transaksi tercatat di blockchain, memberikan
                  transparansi penuh kepada donatur
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-space-grotesk font-semibold text-lg mb-2">
                  Komunitas Kuat
                </h3>
                <p className="text-muted-foreground">
                  Bergabung dengan komunitas kampus yang peduli dan saling
                  mendukung untuk kemajuan bersama
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-space-grotesk font-semibold text-lg mb-2">
                  Dampak Nyata
                </h3>
                <p className="text-muted-foreground">
                  Setiap kontribusi memberikan dampak langsung untuk kemajuan
                  program dan fasilitas kampus
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-primary p-8 md:p-12 border-0">
            <CardContent className="p-0">
              <h2 className="font-space-grotesk text-3xl font-bold text-primary-foreground mb-4">
                Siap Memulai?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan mahasiswa lainnya dalam menciptakan
                perubahan positif di kampus
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isOwner && (
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/create">
                      <Target className="w-5 h-5 mr-2" />
                      Buat Program
                    </Link>
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <Link to="/programs">
                    <Heart className="w-5 h-5 mr-2" />
                    Dukung Program
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
