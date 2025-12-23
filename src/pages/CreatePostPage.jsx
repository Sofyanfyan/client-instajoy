import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../contexts/PostContext";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { ImagePlus, X, ArrowLeft, Sparkles } from "lucide-react";

const sampleImages = [
  "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1682695794816-7b9da18ed470?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop",
];

const CreatePostPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const { addPost } = usePost();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageSelect = (url) => {
    setImageUrl(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "Gambar Diperlukan",
        description: "Pilih gambar untuk post Anda",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addPost(imageUrl, caption);

    toast({
      title: "Post Berhasil! 🎉",
      description: "Post Anda telah dipublikasikan",
    });

    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Buat Post Baru</h1>
        <Button
          onClick={handleSubmit}
          variant="instagram"
          size="sm"
          disabled={isSubmitting || !imageUrl}>
          {isSubmitting ? "Posting..." : "Bagikan"}
        </Button>
      </div>

      {/* Image Preview */}
      <div className="mb-6">
        {imageUrl ? (
          <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setImageUrl("")}
              className="absolute top-3 right-3 p-2 bg-foreground/80 rounded-full text-background hover:bg-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square bg-secondary border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
            <ImagePlus className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">
              Klik untuk upload gambar
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              atau pilih dari galeri di bawah
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Sample Gallery */}
      {!imageUrl && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Galeri Contoh</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sampleImages.map((url, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(url)}
                className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                <img
                  src={url}
                  alt={`Sample ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Caption */}
      <div>
        <label className="block font-semibold mb-2">Caption</label>
        <Textarea
          placeholder="Tulis caption untuk post Anda..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="min-h-[120px] resize-none"
        />
        <p className="text-sm text-muted-foreground mt-2">
          💡 Tip: Gunakan hashtag untuk meningkatkan jangkauan post Anda
        </p>
      </div>
    </div>
  );
};

export default CreatePostPage;
