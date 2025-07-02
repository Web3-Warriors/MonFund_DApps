import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProgramCard } from "@/components/ProgramCard";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Coins, Heart, Target, Users, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useReadContract } from "wagmi";
import {
  CROWDFUNDING_CONTRACT_ADDRESS,
  CROWDFUNDING_ABI,
  Program,
} from "@/config/contract";
import { useIsOwner } from "@/hooks/useIsOwner";
import heroImage from "@/assets/hero-img.webp";
import {
  AnimatedSection,
  PageTransition,
  HoverAnimation,
} from "@/components/animations";

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
      <PageTransition>
        <section className="relative py-40 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 opacity-5">
            <img
              src={heroImage}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative container mx-auto text-center">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <Badge
                variant="secondary"
                className="mb-6 bg-primary/20 text-primary border-primary/30 text-sm"
              >
                🚀 Platform Crowdfunding Kampus Berbasis Web3
              </Badge>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.2}>
              <h1 className="font-space-grotesk text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                MonFund: Crowdfunding Kampus
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.3}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Wujudkan Impian Kampus dengan Teknologi Blockchain. Platform
                crowdfunding transparans untuk mendanai program-program inovatif
                di lingkungan kampus.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <HoverAnimation scale={1.05}>
                  <Button
                    size="xl"
                    variant="hero"
                    asChild
                    className="pulse-glow"
                  >
                    <Link to="/programs">
                      <Coins className="w-5 h-5 mr-2" />
                      Jelajahi Program
                    </Link>
                  </Button>
                </HoverAnimation>
                {isOwner && (
                  <HoverAnimation scale={1.05}>
                    <Button size="xl" variant="outline" asChild>
                      <Link to="/create">
                        <Target className="w-5 h-5 mr-2" />
                        Buat Program Baru
                      </Link>
                    </Button>
                  </HoverAnimation>
                )}
              </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection animation="stagger" delay={0.5} staggerDelay={0.2}>
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
                    <div className="text-3xl font-bold text-success mb-2">
                      100%
                    </div>
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
            </AnimatedSection>
          </div>
        </section>
      </PageTransition>

      {/* Features */}
      <AnimatedSection animation="fadeUp">
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <div className="text-center mb-12">
                <h2 className="font-space-grotesk text-3xl font-bold mb-4">
                  Mengapa MonFund?
                </h2>
                <p className="text-muted-foreground text-lg">
                  Platform crowdfunding yang aman, transparan, dan mudah
                  digunakan
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="stagger" staggerDelay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={Shield}
                  title="Aman & Transparan"
                  description="Semua transaksi tercatat di blockchain, memberikan transparansi penuh kepada donatur"
                  delay={0}
                />

                <FeatureCard
                  icon={Users}
                  title="Komunitas Kuat"
                  description="Bergabung dengan komunitas kampus yang peduli dan saling mendukung untuk kemajuan bersama"
                  delay={0.2}
                />

                <FeatureCard
                  icon={TrendingUp}
                  title="Dampak Nyata"
                  description="Setiap kontribusi memberikan dampak langsung untuk kemajuan program dan fasilitas kampus"
                  delay={0.4}
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Programs */}
      {featuredPrograms.length > 0 && (
        <AnimatedSection animation="fadeUp" delay={0.1}>
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <AnimatedSection animation="fadeUp" delay={0.2}>
                  <h2 className="font-space-grotesk text-3xl font-bold mb-4">
                    Program Unggulan
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Temukan program-program menarik yang sedang mencari dukungan
                    dari komunitas kampus
                  </p>
                </AnimatedSection>
              </div>

              <AnimatedSection
                animation="stagger"
                delay={0.3}
                staggerDelay={0.15}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {featuredPrograms.map((program) => (
                    <ProgramCard
                      key={program.id.toString()}
                      program={program}
                    />
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fadeUp" delay={0.4}>
                <div className="text-center">
                  <HoverAnimation scale={1.05}>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/programs">Lihat Semua Program</Link>
                    </Button>
                  </HoverAnimation>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* CTA Section */}
      <AnimatedSection animation="fadeUp">
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <Card className="bg-gradient-primary p-8 md:p-12 border-0">
              <CardContent className="p-0">
                <AnimatedSection animation="fadeUp" delay={0.1}>
                  <h2 className="font-space-grotesk text-3xl font-bold text-primary-foreground mb-4">
                    Bergabunglah dengan MonFund
                  </h2>
                </AnimatedSection>
                <AnimatedSection animation="fadeUp" delay={0.2}>
                  <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                    Bergabunglah dengan ribuan mahasiswa lainnya dalam
                    menciptakan perubahan secara positif di kampus melalui
                    program-program inovatif yang didukung oleh komunitas
                    kampus.
                  </p>
                </AnimatedSection>
                <AnimatedSection
                  animation="stagger"
                  delay={0.3}
                  staggerDelay={0.1}
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {isOwner && (
                      <HoverAnimation scale={1.05} y={-2}>
                        <Button size="lg" variant="secondary" asChild>
                          <Link to="/create">
                            <Target className="w-5 h-5 mr-2" />
                            Buat Program
                          </Link>
                        </Button>
                      </HoverAnimation>
                    )}
                    <HoverAnimation scale={1.05} y={-2}>
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
                    </HoverAnimation>
                  </div>
                </AnimatedSection>
              </CardContent>
            </Card>
          </div>
        </section>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default Index;
