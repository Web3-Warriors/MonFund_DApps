import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Target,
  Users,
  Clock,
  Heart,
  Share,
  AlertCircle,
} from "lucide-react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  CROWDFUNDING_CONTRACT_ADDRESS,
  CROWDFUNDING_ABI,
  Program,
  ProgramStatus,
} from "@/config/contract";

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [contributeAmount, setContributeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDesc, setWithdrawDesc] = useState("");

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: (data, variables) => {
        if (variables.functionName === "contribute") {
          toast({
            title: "Kontribusi berhasil!",
            description: `Terima kasih telah berkontribusi ${contributeAmount} ETH`,
          });
          setContributeAmount("");
        } else if (variables.functionName === "withdraw") {
          toast({
            title: "Penarikan berhasil!",
            description: `Berhasil menarik ${withdrawAmount} ETH`,
          });
          setWithdrawAmount("");
          setWithdrawDesc("");
        }
      },
      onError: (error, variables) => {
        if (variables.functionName === "contribute") {
          toast({
            title: "Kontribusi gagal",
            description: "Terjadi kesalahan saat melakukan kontribusi",
            variant: "destructive",
          });
        } else if (variables.functionName === "withdraw") {
          toast({
            title: "Penarikan gagal",
            description: "Terjadi kesalahan saat melakukan penarikan",
            variant: "destructive",
          });
        }
      },
    },
  });

  // Read program data
  const { data: program, isLoading } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getProgramById",
    args: id ? [BigInt(id)] : undefined,
  });

  // Read withdrawal history
  const { data: withdrawalHistory } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getHistoryWithdrawByProgram",
    args: id ? [BigInt(id)] : undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Program tidak ditemukan</h1>
          <Button asChild>
            <Link to="/programs">Kembali ke Program</Link>
          </Button>
        </div>
      </div>
    );
  }

  const typedProgram = program as Program;
  const progress =
    (Number(typedProgram.totalAmount) / Number(typedProgram.targetFund)) * 100;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (Number(typedProgram.endDate) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );
  const isPIC =
    address && address.toLowerCase() === typedProgram.pic.toLowerCase();
  const isProgramEnded =
    Date.now() > Number(typedProgram.endDate) * 1000 ||
    typedProgram.status === ProgramStatus.Completed;

  const getStatusBadge = (status: ProgramStatus) => {
    switch (status) {
      case ProgramStatus.Active:
        return (
          <Badge
            variant="secondary"
            className="bg-success/20 text-success border-success/30"
          >
            Aktif
          </Badge>
        );
      case ProgramStatus.Completed:
        return (
          <Badge
            variant="secondary"
            className="bg-info/20 text-info border-info/30"
          >
            Selesai
          </Badge>
        );
      case ProgramStatus.Canceled:
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleContribute = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet tidak terhubung",
        description: "Silakan hubungkan wallet Anda terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
      toast({
        title: "Jumlah tidak valid",
        description: "Masukkan jumlah kontribusi yang valid",
        variant: "destructive",
      });
      return;
    }

    writeContract({
      address: CROWDFUNDING_CONTRACT_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: "contribute",
      args: [BigInt(id!)],
      value: parseEther(contributeAmount),
    } as any);
  };

  const handleWithdraw = async () => {
    if (!isProgramEnded) {
      toast({
        title: "Penarikan tidak diizinkan",
        description: "Dana hanya dapat ditarik setelah program berakhir",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAmount || !withdrawDesc) {
      toast({
        title: "Data tidak lengkap",
        description: "Masukkan jumlah dan deskripsi penarikan",
        variant: "destructive",
      });
      return;
    }

    writeContract({
      address: CROWDFUNDING_CONTRACT_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: "withdraw",
      args: [BigInt(id!), parseEther(withdrawAmount), withdrawDesc],
    } as any);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link berhasil disalin!",
        description: "Silahkan bagikan link program ke teman Anda!",
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(textArea);

      toast({
        title: "Link berhasil disalin!",
        description: "URL program telah disalin ke clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/programs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Program
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Image & Title */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={typedProgram.image || "/placeholder.svg"}
                    alt={typedProgram.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(typedProgram.status)}
                  </div>
                </div>
                <div className="p-6">
                  <h1 className="font-space-grotesk text-3xl font-bold mb-4">
                    {typedProgram.title}
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    {typedProgram.desc}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Progress Pendanaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Terkumpul</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {parseFloat(
                        formatEther(typedProgram.totalAmount)
                      ).toFixed(4)}{" "}
                      ETH
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Terkumpul
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {parseFloat(formatEther(typedProgram.targetFund)).toFixed(
                        4
                      )}{" "}
                      ETH
                    </div>
                    <div className="text-sm text-muted-foreground">Target</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal History */}
            {withdrawalHistory && withdrawalHistory.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Riwayat Penarikan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {withdrawalHistory.map((withdrawal: any, index: number) => (
                      <div
                        key={index}
                        className="border-l-2 border-primary pl-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{withdrawal.desc}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                Number(withdrawal.time) * 1000
                              ).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {parseFloat(formatEther(withdrawal.amount)).toFixed(
                              4
                            )}{" "}
                            ETH
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Sisa waktu</span>
                  </div>
                  <span className="font-semibold">{daysLeft} hari</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Berakhir</span>
                  </div>
                  <span className="font-semibold">
                    {new Date(
                      Number(typedProgram.endDate) * 1000
                    ).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contribute */}
            {typedProgram.status === ProgramStatus.Active &&
              !isProgramEnded && (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Dukung Program Ini
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Jumlah (ETH)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.001"
                        placeholder="0.001"
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleContribute}
                      disabled={isPending || !isConnected}
                      className="w-full"
                      variant="hero"
                    >
                      {isPending ? "Memproses..." : "Kontribusi Sekarang"}
                    </Button>
                    {!isConnected && (
                      <p className="text-sm text-muted-foreground text-center">
                        Hubungkan wallet untuk berkontribusi
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

            {/* Program Ended Message */}
            {isProgramEnded && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    Program Berakhir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning">
                      Program ini telah berakhir dan tidak dapat menerima
                      kontribusi lagi.
                      {typedProgram.status === ProgramStatus.Completed
                        ? " Status: Selesai"
                        : " Batas waktu telah terlampaui."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Withdraw (Only for PIC) */}
            {isPIC && isProgramEnded && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Tarik Dana
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                    <p className="text-sm text-info">
                      Program telah berakhir. Anda dapat menarik dana yang
                      tersedia.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="withdrawAmount">Jumlah (ETH)</Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      step="0.001"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maksimal:{" "}
                      {parseFloat(
                        formatEther(
                          typedProgram.totalAmount - typedProgram.withdrawAmount
                        )
                      ).toFixed(4)}{" "}
                      ETH
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="withdrawDesc">Deskripsi Penggunaan</Label>
                    <Textarea
                      id="withdrawDesc"
                      placeholder="Jelaskan untuk apa dana ini akan digunakan..."
                      value={withdrawDesc}
                      onChange={(e) => setWithdrawDesc(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    disabled={isPending}
                    className="w-full"
                    variant="secondary"
                  >
                    {isPending ? "Memproses..." : "Tarik Dana"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Withdrawal Info for PIC when program is still active */}
            {isPIC && !isProgramEnded && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Penarikan Dana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning">
                      Dana hanya dapat ditarik setelah program berakhir (
                      {new Date(
                        Number(typedProgram.endDate) * 1000
                      ).toLocaleDateString("id-ID")}
                      ) atau program diselesaikan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleShare}
                >
                  <Share className="w-4 h-4 mr-2" />
                  Bagikan Program
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProgramDetail;
