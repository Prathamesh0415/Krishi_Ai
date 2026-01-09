"use client";

import { useState, useRef } from "react";
import { 
  UploadCloud, 
  X, 
  ScanSearch, 
  CheckCircle2, 
  AlertTriangle, 
  Sprout, 
  Loader2,
  Stethoscope,
  Info
} from "lucide-react";

// 1. UPDATE: Interface now exactly matches your JSON Schema
interface AnalysisResult {
  disease: string;
  confidence: string;
  description: string;
  advice: string[];
}

export default function DiseasePredictorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setError("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Clear old state immediately
      setResult(null); 
      setError(null);
      
      // Reset input
      e.target.value = ""; 
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Clear old state immediately
      setResult(null);
      setError(null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    
    // Clear previous result to hide old data while loading
    setResult(null); 

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/disease-predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }

      // 2. UPDATE: Set data directly (keys now match)
      setResult(data);
      
    } catch (err) {
      console.error(err);
      setError("Could not analyze the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-emerald-600" />
            Crop Doctor AI
          </h1>
          <p className="text-emerald-600/80 mt-2 text-lg">
            Upload a photo of your plant to instantly identify diseases and get treatment advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Upload Section */}
          <div className="space-y-6">
            <div 
              className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                previewUrl 
                  ? "border-emerald-300 bg-emerald-50/50" 
                  : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50 cursor-pointer"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
              />

              {previewUrl ? (
                <div className="relative group">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-80 w-full object-contain rounded-lg shadow-md mx-auto"
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="py-10 space-y-4">
                  <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <UploadCloud size={40} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={analyzeImage}
              disabled={!selectedFile || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform flex items-center justify-center gap-3 ${
                !selectedFile 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isLoading
                    ? "bg-emerald-800 text-white cursor-wait"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" />
                  Analyzing Crop...
                </>
              ) : (
                <>
                  <ScanSearch className="w-6 h-6" />
                  Identify Disease
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results Section */}
          <div className="lg:pl-8">
            {!result && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-gray-100 rounded-2xl bg-white/50 text-gray-400 min-h-[400px]">
                <Sprout className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-lg">No analysis yet.</p>
                <p className="text-sm">Upload an image to see the diagnosis here.</p>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-emerald-100 rounded-2xl bg-white min-h-[400px]">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <Sprout className="absolute inset-0 m-auto text-emerald-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Consulting AI...</h3>
                <p className="text-gray-500 mt-2">Checking symptoms and patterns</p>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 3. UPDATE: Use result.disease */}
                <div className="bg-emerald-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Diagnosis</p>
                      <h2 className="text-2xl font-bold mt-1">{result.disease}</h2>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        result.confidence.toLowerCase().includes("low") 
                        ? "bg-yellow-500/20 border-yellow-200 text-yellow-100" 
                        : "bg-white/20 border-white/30 text-white"
                    }`}>
                      {result.confidence}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* 4. UPDATE: Added Description Section */}
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                     <div className="flex items-center gap-2 mb-2 text-emerald-800 font-semibold">
                       <Info className="w-5 h-5" />
                       Overview
                     </div>
                     <p className="text-gray-700 leading-relaxed">
                       {result.description}
                     </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Treatment Advice
                    </h3>
                    
                    {/* 5. UPDATE: Use result.advice */}
                    <ul className="space-y-3">
                      {(result.advice || []).map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 text-amber-800 text-xs mt-4">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <p>
                      AI diagnosis may not be 100% accurate. Consult a local agriculture expert before applying chemical treatments.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}