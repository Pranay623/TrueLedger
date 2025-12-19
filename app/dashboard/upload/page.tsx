"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, FileText, CheckCircle2, Image as ImageIcon, X } from "lucide-react";

interface UploadResponse {
  fileUrl: string;
  fileType: string;
  s3Key: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<"idle" | "uploading" | "success">("idle");
  const [uploadedData, setUploadedData] = useState<UploadResponse | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<{ title: string; description: string }>();

  // 1. Upload Image Mutation
  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const res = await fetch("/api/upload/certificate-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");
      return res.json() as Promise<UploadResponse>;
    },
    onSuccess: (data) => {
      setUploadedData(data);
      setUploadStep("success");
    },
  });

  // 2. Create Certificate Mutation
  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      if (!uploadedData) throw new Error("No image uploaded");

      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          fileUrl: uploadedData.fileUrl,
          fileType: uploadedData.fileType,
          s3Key: uploadedData.s3Key,
        }),
      });

      if (!res.ok) throw new Error("Failed to create certificate");
      return res.json();
    },
    onSuccess: () => {
      router.push("/dashboard/certificates");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }
      setFile(selected);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setUploadStep("idle");
    setUploadedData(null);
    // Reset file input (tricky in React, usually ref is better but this works for simple cases)
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const onUpload = async () => {
    if (!file) return;
    setUploadStep("uploading");
    uploadMutation.mutate(file);
  };

  const onSubmit = (data: { title: string; description: string }) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-mono text-white mb-2">Upload Certificate</h1>
        <p className="text-gray-400">Securely upload and register your certificates on the blockchain.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

        {/* Left: Form */}
        <div className="space-y-6">
          <Card className="bg-black/40 border-emerald-900/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>Enter the metadata for your certificate.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="cert-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Certificate Title</Label>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. Advanced Web Development"
                    className="bg-black/20 border-emerald-900/20 focus:border-emerald-500/50"
                  />
                  {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Optional description..."
                    className="bg-black/20 border-emerald-900/20 focus:border-emerald-500/50 min-h-[100px]"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-800 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={!uploadedData || createMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-500 min-w-[150px]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Create Certificate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Upload Area */}
        <div className="space-y-6">
          <Card className="bg-black/40 border-emerald-900/20 backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle>Certificate Image</CardTitle>
              <CardDescription>Supported formats: JPG, PNG, PDF</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Upload Box */}
              {!preview ? (
                <div className="border-2 border-dashed border-emerald-900/30 rounded-xl p-8 text-center hover:border-emerald-500/50 hover:bg-emerald-900/5 transition-all">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer block space-y-4">
                    <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-emerald-400 font-medium">Click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">or drag and drop here</p>
                    </div>
                  </Label>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-emerald-900/30 group">
                  {/* Preview Image */}
                  {file?.type.includes('image') ? (
                    <img src={preview} alt="Preview" className="w-full h-auto object-cover" />
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-black/20 text-gray-400 flex-col gap-2">
                      <FileText className="w-12 h-12" />
                      <p>{file?.name}</p>
                    </div>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleRemoveFile}
                      size="icon"
                      className="rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload Status / Trigger */}
              {file && !uploadedData && (
                <Button
                  onClick={onUpload}
                  disabled={uploadMutation.isPending}
                  className="w-full bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 border border-emerald-900/50"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload to IPFS/S3
                    </>
                  )}
                </Button>
              )}

              {uploadedData && (
                <Alert className="bg-emerald-500/10 border-emerald-500/50 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    Image uploaded successfully
                  </AlertDescription>
                </Alert>
              )}

              {uploadMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to upload image
                  </AlertDescription>
                </Alert>
              )}
              {createMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to create certificate
                  </AlertDescription>
                </Alert>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
