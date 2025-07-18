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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsOwner } from "@/hooks/useIsOwner";
import {
  ArrowLeft,
  Calendar,
  Target,
  Users,
  Clock,
  Heart,
  Share,
  AlertCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  CROWDFUNDING_CONTRACT_ADDRESS,
  CROWDFUNDING_ABI,
  Program,
  ProgramStatus,
} from "@/config/contract";
import {
  AnimatedSection,
  PageTransition,
  HoverAnimation,
} from "@/components/animations";

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { address, isConnected } = useAccount();
  const { isOwner } = useIsOwner();
  const { toast } = useToast();
  const [contributeAmount, setContributeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDesc, setWithdrawDesc] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: (data, variables) => {
        if (variables.functionName === "contribute") {
          toast({
            title: "Kontribusi berhasil!",
            description: `Terima kasih telah berkontribusi ${contributeAmount} ETH`,
          });
          setContributeAmount("");
          // Refresh data after successful contribution
          refetchProgram();
        } else if (variables.functionName === "withdraw") {
          toast({
            title: "Penarikan berhasil!",
            description: `Berhasil menarik ${withdrawAmount} ETH`,
          });
          setWithdrawAmount("");
          setWithdrawDesc("");
          // Refresh data after successful withdrawal
          refetchProgram();
          refetchWithdrawals();
        } else if (variables.functionName === "cancelAndRefund") {
          toast({
            title: "Program berhasil dibatalkan!",
            description: "Dana telah dikembalikan ke semua kontributor",
          });
          // Refresh data after successful cancellation
          refetchProgram();
          refetchWithdrawals();
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
        } else if (variables.functionName === "cancelAndRefund") {
          toast({
            title: "Pembatalan gagal",
            description: "Terjadi kesalahan saat membatalkan program",
            variant: "destructive",
          });
        }
      },
    },
  });

  // Read program data
  const {
    data: program,
    isLoading,
    refetch: refetchProgram,
  } = useReadContract({
    address: CROWDFUNDING_CONTRACT_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getProgramById",
    args: id ? [BigInt(id)] : undefined,
  });

  // Read withdrawal history
  const { data: withdrawalHistory, refetch: refetchWithdrawals } =
    useReadContract({
      address: CROWDFUNDING_CONTRACT_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: "getHistoryWithdrawByProgram",
      args: id ? [BigInt(id)] : undefined,
    });

  if (isLoading) {
    return (
      <PageTransition className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <AnimatedSection animation="fadeUp" className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="h-32 bg-muted rounded"></div>
          </AnimatedSection>
        </div>
      </PageTransition>
    );
  }

  if (!program) {
    return (
      <PageTransition className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <AnimatedSection animation="fadeUp">
            <h1 className="text-2xl font-bold mb-4">Program tidak ditemukan</h1>
            <HoverAnimation scale={1.05}>
              <Button asChild>
                <Link to="/programs">Kembali ke Program</Link>
              </Button>
            </HoverAnimation>
          </AnimatedSection>
        </div>
      </PageTransition>
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
    if (!isPIC) {
      toast({
        title: "Akses ditolak",
        description: "Hanya PIC yang dapat menarik dana",
        variant: "destructive",
      });
      return;
    }

    if (!isProgramEnded) {
      toast({
        title: "Penarikan tidak diizinkan",
        description: "Dana hanya dapat ditarik setelah program berakhir",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Jumlah tidak valid",
        description: "Masukkan jumlah penarikan yang valid",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawDesc || withdrawDesc.trim().length < 10) {
      toast({
        title: "Deskripsi tidak lengkap",
        description: "Masukkan deskripsi penggunaan minimal 10 karakter",
        variant: "destructive",
      });
      return;
    }

    // Validate withdrawal amount
    const availableAmount =
      typedProgram.totalAmount - typedProgram.withdrawAmount;
    const requestedAmount = parseEther(withdrawAmount);

    if (requestedAmount > availableAmount) {
      toast({
        title: "Jumlah melebihi saldo",
        description: `Maksimal yang dapat ditarik: ${parseFloat(
          formatEther(availableAmount)
        ).toFixed(4)} ETH`,
        variant: "destructive",
      });
      return;
    }

    try {
      await writeContract({
        address: CROWDFUNDING_CONTRACT_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "withdraw",
        args: [BigInt(id!), requestedAmount, withdrawDesc.trim()],
      } as any);
    } catch (error: any) {
      console.error("Withdraw error:", error);

      // Handle specific error cases
      let errorMessage = "Terjadi kesalahan saat melakukan penarikan";

      if (error.message?.includes("insufficient funds")) {
        errorMessage = "Saldo tidak mencukupi untuk penarikan";
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaksi dibatalkan oleh pengguna";
      } else if (error.message?.includes("execution reverted")) {
        errorMessage =
          "Transaksi ditolak oleh kontrak. Periksa kondisi program.";
      }

      toast({
        title: "Penarikan gagal",
        description: errorMessage,
        variant: "destructive",
      });
    }
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

  const handleCancelAndRefund = async () => {
    if (!isOwner) {
      toast({
        title: "Akses ditolak",
        description: "Hanya admin yang dapat membatalkan program",
        variant: "destructive",
      });
      return;
    }

    if (
      typedProgram.status !== ProgramStatus.Active &&
      typedProgram.status !== ProgramStatus.Completed
    ) {
      toast({
        title: "Program tidak dapat dibatalkan",
        description: "Hanya program aktif atau selesai yang dapat dibatalkan",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog
    setShowCancelDialog(true);
  };

  const confirmCancelAndRefund = async () => {
    setShowCancelDialog(false);

    try {
      await writeContract({
        address: CROWDFUNDING_CONTRACT_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "cancelAndRefund",
        args: [BigInt(id!)],
      } as any);
    } catch (error: any) {
      console.error("Cancel and refund error:", error);

      let errorMessage = "Terjadi kesalahan saat membatalkan program";

      if (error.message?.includes("Not Active or Completed")) {
        errorMessage = "Program tidak dalam status yang dapat dibatalkan";
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaksi dibatalkan oleh pengguna";
      } else if (error.message?.includes("execution reverted")) {
        errorMessage = "Transaksi ditolak oleh kontrak";
      } else if (error.message?.includes("CancelAndRefundFailed")) {
        errorMessage = "Gagal mengembalikan dana ke beberapa kontributor";
      }

      toast({
        title: "Pembatalan gagal",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <PageTransition className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <AnimatedSection animation="fadeUp" delay={0.1}>
          <HoverAnimation scale={1.05}>
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/programs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Program
              </Link>
            </Button>
          </HoverAnimation>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Image & Title */}
            <AnimatedSection animation="fadeUp" delay={0.2}>
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
            </AnimatedSection>

            {/* Progress */}
            <AnimatedSection animation="fadeUp" delay={0.3}>
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
                        {parseFloat(
                          formatEther(typedProgram.targetFund)
                        ).toFixed(4)}{" "}
                        ETH
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Target
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Withdrawal History */}
            {withdrawalHistory && withdrawalHistory.length > 0 && (
              <AnimatedSection animation="fadeUp" delay={0.4}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Riwayat Penarikan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {withdrawalHistory.map(
                        (withdrawal: any, index: number) => (
                          <HoverAnimation key={index} scale={1.02}>
                            <div className="border-l-2 border-primary pl-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">
                                    {withdrawal.desc}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      Number(withdrawal.time) * 1000
                                    ).toLocaleDateString("id-ID")}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  {parseFloat(
                                    formatEther(withdrawal.amount)
                                  ).toFixed(4)}{" "}
                                  ETH
                                </Badge>
                              </div>
                            </div>
                          </HoverAnimation>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <AnimatedSection animation="fadeLeft" delay={0.3}>
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
            </AnimatedSection>

            {/* Contribute */}
            {typedProgram.status === ProgramStatus.Active &&
              !isProgramEnded && (
                <AnimatedSection animation="fadeLeft" delay={0.4}>
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
                      <HoverAnimation scale={1.02}>
                        <Button
                          onClick={handleContribute}
                          disabled={isPending || !isConnected}
                          className="w-full"
                          variant="hero"
                        >
                          {isPending ? "Memproses..." : "Kontribusi Sekarang"}
                        </Button>
                      </HoverAnimation>
                      {!isConnected && (
                        <p className="text-sm text-muted-foreground text-center">
                          Hubungkan wallet untuk berkontribusi
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

            {/* Program Ended Message */}
            {isProgramEnded && (
              <AnimatedSection animation="fadeLeft" delay={0.4}>
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
              </AnimatedSection>
            )}

            {/* Withdraw (Only for PIC) */}
            {isPIC &&
              isProgramEnded &&
              typedProgram.status !== ProgramStatus.Canceled && (
                <AnimatedSection animation="fadeLeft" delay={0.5}>
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
                              typedProgram.totalAmount -
                                typedProgram.withdrawAmount
                            )
                          ).toFixed(4)}{" "}
                          ETH
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="withdrawDesc">
                          Deskripsi Penggunaan
                        </Label>
                        <Textarea
                          id="withdrawDesc"
                          placeholder="Jelaskan untuk apa dana ini akan digunakan..."
                          value={withdrawDesc}
                          onChange={(e) => setWithdrawDesc(e.target.value)}
                        />
                      </div>
                      <HoverAnimation scale={1.02}>
                        <Button
                          onClick={handleWithdraw}
                          disabled={isPending}
                          className="w-full"
                          variant="secondary"
                        >
                          {isPending ? "Memproses..." : "Tarik Dana"}
                        </Button>
                      </HoverAnimation>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

            {/* Withdrawal Info for PIC when program is still active */}
            {isPIC &&
              !isProgramEnded &&
              typedProgram.status !== ProgramStatus.Canceled && (
                <AnimatedSection animation="fadeLeft" delay={0.5}>
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
                </AnimatedSection>
              )}

            {/* Canceled Program Info for PIC */}
            {isPIC && typedProgram.status === ProgramStatus.Canceled && (
              <AnimatedSection animation="fadeLeft" delay={0.5}>
                <Card className="bg-destructive/5 backdrop-blur-sm border-destructive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <XCircle className="w-5 h-5" />
                      Program Dibatalkan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">
                        Program ini telah dibatalkan. Semua dana yang terkumpul
                        telah dikembalikan kepada kontributor secara otomatis.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Share */}
            <AnimatedSection animation="fadeLeft" delay={0.6}>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <HoverAnimation scale={1.02}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleShare}
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Bagikan Program
                    </Button>
                  </HoverAnimation>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Cancel Program (Admin Only) */}
            {isOwner &&
              (typedProgram.status === ProgramStatus.Active ||
                typedProgram.status === ProgramStatus.Completed) && (
                <AnimatedSection animation="fadeLeft" delay={0.7}>
                  <Card className="bg-destructive/5 backdrop-blur-sm border-destructive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <XCircle className="w-5 h-5" />
                        Zona Admin
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive font-medium">
                          ⚠️ Tindakan Berbahaya
                        </p>
                        <p className="text-xs text-destructive/80 mt-1">
                          Membatalkan program akan mengembalikan semua dana ke
                          kontributor dan tidak dapat dibatalkan.
                        </p>
                      </div>
                      <HoverAnimation scale={1.02}>
                        <Button
                          onClick={handleCancelAndRefund}
                          disabled={isPending}
                          className="w-full"
                          variant="destructive"
                        >
                          {isPending ? "Memproses..." : "Batalkan & Refund"}
                        </Button>
                      </HoverAnimation>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-lg border-destructive/20">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-destructive/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold text-destructive">
              Batalkan Program & Refund
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              <p className="text-muted-foreground">
                Apakah Anda yakin ingin membatalkan program ini?
              </p>
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg space-y-2">
                <div className="flex justify-center items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    Konsekuensi dari tindakan ini:
                  </span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Semua dana akan dikembalikan ke kontributor</li>
                  <li>• Program akan ditandai sebagai "Dibatalkan"</li>
                  <li>• Tindakan ini tidak dapat dibatalkan</li>
                  <li>• Semua kontributor akan mendapat refund otomatis</li>
                </ul>
              </div>
              <p className="text-sm text-destructive font-medium">
                Pastikan Anda benar-benar yakin dengan keputusan ini!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              className="flex-1"
              onClick={() => setShowCancelDialog(false)}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-destructive hover:bg-destructive/90"
              onClick={confirmCancelAndRefund}
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Ya, Batalkan Program"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
};

export default ProgramDetail;
