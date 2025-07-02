import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Calendar, Target, RefreshCw } from "lucide-react";
import { useAccount, useReadContract, useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import { formatEther } from "viem";
import {
  CROWDFUNDING_CONTRACT_ADDRESS,
  CROWDFUNDING_ABI,
  Program,
} from "@/config/contract";
import { Link } from "react-router-dom";

interface UserContribution {
  program: Program;
  amount: bigint;
}

const MyContributions = () => {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const [userContributions, setUserContributions] = useState<
    UserContribution[]
  >([]);
  const [totalContributed, setTotalContributed] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  // Read all programs
  const { data: programIds, refetch: refetchPrograms } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getListProgramId",
  });

  // Effect to fetch contribution data
  useEffect(() => {
    const fetchContributions = async () => {
      if (!address || !programIds || !config) {
        setUserContributions([]);
        setTotalContributed(BigInt(0));
        return;
      }

      setIsLoading(true);
      try {
        const contributions: UserContribution[] = [];
        let total = BigInt(0);

        for (const programId of programIds as bigint[]) {
          try {
            // Get program details first
            const programData = (await readContract(config, {
              address: CROWDFUNDING_CONTRACT_ADDRESS,
              abi: CROWDFUNDING_ABI,
              functionName: "getProgramById",
              args: [programId],
            })) as Program;

            if (!programData) continue;

            // Check contribution history for this program
            let userContributionAmount = BigInt(0);
            let index = 0;
            const maxIterations = 100; // Prevent infinite loops

            while (index < maxIterations) {
              try {
                const contributionResult = await readContract(config, {
                  address: CROWDFUNDING_CONTRACT_ADDRESS,
                  abi: CROWDFUNDING_ABI,
                  functionName: "contributeHistory",
                  args: [programId, BigInt(index)],
                });

                // The result is a tuple [address, amount]
                const [contributorAddress, amount] = contributionResult as [
                  string,
                  bigint
                ];

                if (
                  !contributorAddress ||
                  contributorAddress ===
                    "0x0000000000000000000000000000000000000000"
                ) {
                  // Reached the end of contributions
                  break;
                }

                if (
                  contributorAddress.toLowerCase() === address.toLowerCase()
                ) {
                  userContributionAmount += amount;
                }

                index++;
              } catch (error) {
                // If we get an error, it likely means we've reached the end of contributions
                break;
              }
            }

            // If user has contributed to this program, add it to the list
            if (userContributionAmount > 0) {
              contributions.push({
                program: programData,
                amount: userContributionAmount,
              });
              total += userContributionAmount;
            }
          } catch (error) {
            console.error(
              `Error fetching contributions for program ${programId}:`,
              error
            );
          }
        }

        setUserContributions(contributions);
        setTotalContributed(total);
      } catch (error) {
        console.error("Error fetching user contributions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, [address, programIds, config]);

  // Refetch data when component mounts
  useEffect(() => {
    if (isConnected) {
      refetchPrograms();
    }
  }, [isConnected, refetchPrograms]);

  const handleRefresh = () => {
    refetchPrograms();
  };

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
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="font-space-grotesk text-4xl font-bold">
              Kontribusi Saya
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="ml-4"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">
            Lihat semua program yang telah Anda dukung dan dampaknya
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {userContributions.length}
              </div>
              <div className="text-muted-foreground">Program Didukung</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {parseFloat(formatEther(totalContributed)).toFixed(4)}
              </div>
              <div className="text-muted-foreground">
                Total Kontribusi (ETH)
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-info mb-2">
                {
                  userContributions.filter((uc) => uc.program.status === 1)
                    .length
                }
              </div>
              <div className="text-muted-foreground">Program Berhasil</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Memuat riwayat kontribusi...
            </p>
          </div>
        ) : (
          <>
            {/* Contributions List */}
            {userContributions.length > 0 ? (
              <div className="space-y-6">
                <h2 className="font-space-grotesk text-2xl font-semibold">
                  Program yang Didukung
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userContributions.map((userContrib) => {
                    const { program } = userContrib;
                    const progress =
                      (Number(program.totalAmount) /
                        Number(program.targetFund)) *
                      100;

                    return (
                      <Card
                        key={program.id.toString()}
                        className="group hover:shadow-card transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50"
                      >
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="font-space-grotesk text-lg line-clamp-2">
                              {program.title}
                            </CardTitle>
                            <Badge
                              variant={
                                program.status === 1 ? "secondary" : "outline"
                              }
                              className="ml-2"
                            >
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
                                <span className="font-medium">
                                  {Math.round(progress)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(progress, 100)}%`,
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>
                                  {parseFloat(
                                    formatEther(program.totalAmount)
                                  ).toFixed(4)}{" "}
                                  ETH
                                </span>
                                <span>
                                  dari{" "}
                                  {parseFloat(
                                    formatEther(program.targetFund)
                                  ).toFixed(4)}{" "}
                                  ETH
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    Number(program.endDate) * 1000
                                  ).toLocaleDateString("id-ID")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-primary" />
                                <span>
                                  {parseFloat(
                                    formatEther(userContrib.amount)
                                  ).toFixed(4)}{" "}
                                  ETH
                                </span>
                              </div>
                            </div>

                            <Button
                              asChild
                              variant="outline"
                              className="w-full"
                            >
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
                  Mulai dukung program-program menarik di kampus dan buat dampak
                  positif!
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
            {userContributions.length > 0 && (
              <Card className="mt-12 bg-gradient-primary p-8 border-0">
                <CardContent className="p-0 text-center">
                  <h2 className="font-space-grotesk text-2xl font-bold text-primary-foreground mb-4">
                    Terima Kasih!
                  </h2>
                  <p className="text-primary-foreground/80 text-lg mb-6">
                    Kontribusi Anda telah membantu mewujudkan{" "}
                    {userContributions.length} program di kampus
                  </p>
                  <div className="flex justify-center space-x-8 text-primary-foreground">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {userContributions.length}
                      </div>
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
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyContributions;
