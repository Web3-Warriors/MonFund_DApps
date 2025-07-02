import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProgramCard } from "@/components/ProgramCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Coins } from "lucide-react";
import { useReadContract, useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import {
  CROWDFUNDING_CONTRACT_ADDRESS,
  CROWDFUNDING_ABI,
  Program,
  ProgramStatus,
} from "@/config/contract";

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const config = useConfig();

  // Read all programs from contract
  const {
    data: programIds,
    isLoading: isLoadingIds,
    refetch: refetchIds,
    error: idsError,
  } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getListProgramId",
  });

  // Debug logging
  useEffect(() => {
    console.log("Programs component - programIds:", programIds);
    console.log("Programs component - isLoadingIds:", isLoadingIds);
    console.log("Programs component - idsError:", idsError);
  }, [programIds, isLoadingIds, idsError]);

  // Fetch programs when programIds change
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!programIds || programIds.length === 0) {
        setPrograms([]);
        return;
      }

      setIsLoadingPrograms(true);
      try {
        const fetchedPrograms: Program[] = [];

        for (const id of programIds as bigint[]) {
          try {
            const programData = await readContract(config, {
              address: CROWDFUNDING_CONTRACT_ADDRESS,
              abi: CROWDFUNDING_ABI,
              functionName: "getProgramById",
              args: [id],
            });

            if (programData) {
              fetchedPrograms.push(programData as Program);
            }
          } catch (error) {
            console.error(`Error fetching program ${id}:`, error);
          }
        }

        setPrograms(fetchedPrograms);
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      } finally {
        setIsLoadingPrograms(false);
      }
    };

    fetchPrograms();
  }, [programIds, config]);

  // Refetch data when component mounts or when navigating back
  useEffect(() => {
    // Add a small delay to ensure proper mounting
    const timer = setTimeout(() => {
      refetchIds();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Also refetch when the component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetchIds();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetchIds]);

  // Filter programs based on search and status
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && program.status === ProgramStatus.Active) ||
      (statusFilter === "completed" &&
        program.status === ProgramStatus.Completed);

    return matchesSearch && matchesStatus;
  });

  const activePrograms = programs.filter(
    (p) => p.status === ProgramStatus.Active
  );
  const completedPrograms = programs.filter(
    (p) => p.status === ProgramStatus.Completed
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-space-grotesk text-4xl font-bold mb-4">
            Jelajahi Program
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Temukan program-program menarik yang dapat Anda dukung untuk
            kemajuan kampus
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {programs.length}
              </div>
              <div className="text-muted-foreground">Total Program</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {activePrograms.length}
              </div>
              <div className="text-muted-foreground">Program Aktif</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-info mb-2">
                {completedPrograms.length}
              </div>
              <div className="text-muted-foreground">Program Selesai</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Badge
              variant={statusFilter === "all" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setStatusFilter("all")}
            >
              Semua
            </Badge>
            <Badge
              variant={statusFilter === "active" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setStatusFilter("active")}
            >
              Aktif
            </Badge>
            <Badge
              variant={statusFilter === "completed" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setStatusFilter("completed")}
            >
              Selesai
            </Badge>
          </div>
        </div>

        {/* Programs Grid */}
        {isLoadingIds || isLoadingPrograms ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat program...</p>
          </div>
        ) : idsError ? (
          <div className="text-center py-12">
            <Coins className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-space-grotesk text-xl font-semibold mb-2">
              Gagal memuat program
            </h3>
            <p className="text-muted-foreground mb-6">
              Terjadi kesalahan saat mengambil data program. Pastikan Anda
              terhubung ke jaringan yang benar.
            </p>
            <Button
              variant="hero"
              onClick={() => {
                refetchIds();
                window.location.reload();
              }}
            >
              Muat Ulang
            </Button>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.id.toString()} program={program} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Coins className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-space-grotesk text-xl font-semibold mb-2">
              {searchTerm || statusFilter !== "all"
                ? "Tidak ada program yang ditemukan"
                : "Belum ada program"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Coba ubah kriteria pencarian atau filter Anda"
                : "Jadilah yang pertama membuat program crowdfunding!"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button variant="hero" asChild>
                <a href="/create">Buat Program Pertama</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
