import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, Target, User, Image, AlertCircle } from "lucide-react";
import { useWriteContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import {
  CROWDFUNDING_CONTRACT_ADDRESS,
  CROWDFUNDING_ABI,
} from "@/config/contract";
import { useNavigate, Link } from "react-router-dom";
import { useIsOwner } from "@/hooks/useIsOwner";

const CreateProgram = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const { isOwner, isLoading: isOwnerLoading } = useIsOwner();

  // Redirect non-owners to programs page
  useEffect(() => {
    if (!isOwnerLoading && !isOwner && isConnected) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya admin yang dapat membuat program",
        variant: "destructive",
      });
      navigate("/programs");
    }
  }, [isOwner, isOwnerLoading, isConnected, navigate, toast]);

  // Show loading while checking owner status
  if (isOwnerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Show access denied message for non-owners
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Akses Ditolak</h1>
            <p className="text-muted-foreground mb-6">
              Hanya admin yang memiliki izin untuk membuat program crowdfunding.
            </p>
            <Button asChild>
              <Link to="/programs">Kembali ke Program</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Program berhasil dibuat!",
          description: "Program crowdfunding Anda telah berhasil dibuat",
        });
        // Reset form
        setFormData({
          title: "",
          description: "",
          image: "",
          pic: "",
          targetFund: "",
          startDate: "",
          endDate: "",
        });

        // Add a small delay before navigation to allow blockchain to update
        setTimeout(() => {
          navigate("/programs");
          setIsCreating(false);
        }, 1000);
      },
      onError: (error) => {
        console.error("Error creating program:", error);
        toast({
          title: "Gagal membuat program",
          description:
            "Terjadi kesalahan saat membuat program. Pastikan Anda adalah owner contract.",
          variant: "destructive",
        });
        setIsCreating(false);
      },
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    pic: "",
    targetFund: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({
        title: "Wallet tidak terhubung",
        description: "Silakan hubungkan wallet Anda terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.pic ||
      !formData.targetFund ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    const startTimestamp = Math.floor(
      new Date(formData.startDate).getTime() / 1000
    );
    const endTimestamp = Math.floor(
      new Date(formData.endDate).getTime() / 1000
    );

    if (endTimestamp <= startTimestamp) {
      toast({
        title: "Tanggal tidak valid",
        description: "Tanggal berakhir harus setelah tanggal mulai",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    writeContract({
      address: CROWDFUNDING_CONTRACT_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: "createProgram",
      args: [
        formData.title,
        formData.description,
        formData.image ||
          "https://via.placeholder.com/400x300?text=Program+Image",
        formData.pic as `0x${string}`,
        parseEther(formData.targetFund),
        BigInt(startTimestamp),
        BigInt(endTimestamp),
      ],
    } as any);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="font-space-grotesk text-4xl font-bold mb-4">
              Buat Program Baru
            </h1>
            <p className="text-muted-foreground text-lg">
              Mulai kampanye crowdfunding untuk program inovatif di kampus Anda
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Informasi Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Judul Program *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul program yang menarik"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Deskripsi Program *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Jelaskan secara detail tentang program Anda, tujuan, dan dampak yang diharapkan..."
                    rows={4}
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <Label htmlFor="image">URL Gambar</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg (opsional)"
                    type="url"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Jika kosong, akan menggunakan gambar default
                  </p>
                </div>

                {/* PIC Address */}
                <div>
                  <Label htmlFor="pic">
                    Alamat Wallet PIC (Person in Charge) *
                  </Label>
                  <Input
                    id="pic"
                    name="pic"
                    value={formData.pic}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Alamat wallet yang akan bertanggung jawab mengelola dana
                  </p>
                </div>

                {/* Target Fund */}
                <div>
                  <Label htmlFor="targetFund">Target Dana (ETH) *</Label>
                  <Input
                    id="targetFund"
                    name="targetFund"
                    value={formData.targetFund}
                    onChange={handleInputChange}
                    placeholder="1.0"
                    type="number"
                    step="0.001"
                    min="0.001"
                    required
                  />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Tanggal Mulai *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      type="datetime-local"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Tanggal Berakhir *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      type="datetime-local"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isCreating || !isConnected}
                    className="w-full"
                    variant="hero"
                    size="lg"
                  >
                    {isCreating ? "Membuat Program..." : "Buat Program"}
                  </Button>

                  {!isConnected && (
                    <p className="text-sm text-muted-foreground text-center mt-3">
                      Hubungkan wallet untuk membuat program
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-info/10 border-info/30">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-info">
                Informasi Penting
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hanya owner contract yang dapat membuat program baru</li>
                <li>
                  • PIC akan memiliki akses untuk menarik dana yang terkumpul
                </li>
                <li>
                  • Semua transaksi tercatat di blockchain untuk transparansi
                </li>
                <li>• Program tidak dapat diubah setelah dibuat</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
