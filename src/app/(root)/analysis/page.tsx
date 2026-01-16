"use client";

import { useState } from "react";
import { 
  UploadCloud, 
  Sprout, 
  MapPin, 
  Leaf, 
  ThermometerSun, 
  Droplets, 
  CloudRain, 
  //FlaskConical, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Types matching your Backend
interface ExtractedData {
  n: string | number;
  p: string | number;
  k: string | number;
  ph: string | number;
  temperature: string | number;
  humidity: string | number;
  rainfall: string | number;
}

export default function CropRecommender() {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState("Delhi");
  const [step, setStep] = useState<"upload" | "review" | "result">("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to hold data between Extract and Predict steps
  const [formData, setFormData] = useState<ExtractedData>({
    n: "", p: "", k: "", ph: "", 
    temperature: "", humidity: "", rainfall: ""
  });

  const [prediction, setPrediction] = useState<string | null>(null);

  // --- STEP 1: EXTRACT ---
  const handleExtract = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      // Note: Added query param for location
      const res = await fetch(`http://127.0.0.1:8000/extract?location=${location}`, {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("Failed to extract data");

      const data = await res.json();

      // Map backend keys (Capitalized) to Pydantic keys (lowercase)
      // handling the "-" or missing values by defaulting to empty string
      setFormData({
        n: data.N === "-" ? "" : data.N,
        p: data.P === "-" ? "" : data.P,
        k: data.K === "-" ? "" : data.K,
        ph: data.pH === "-" ? "" : data.pH,
        temperature: data.temperature === "-" ? "" : data.temperature,
        humidity: data.humidity === "-" ? "" : data.humidity,
        rainfall: data.rainfall === "-" ? "" : data.rainfall,
      });

      setStep("review");
    } catch (err) {
      setError("Error extracting data. Please ensure the PDF is valid.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: PREDICT ---
  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert string inputs to floats for the backend
      const payload = {
        n: parseFloat(String(formData.n)),
        p: parseFloat(String(formData.p)),
        k: parseFloat(String(formData.k)),
        ph: parseFloat(String(formData.ph)),
        temperature: parseFloat(String(formData.temperature)),
        humidity: parseFloat(String(formData.humidity)),
        rainfall: parseFloat(String(formData.rainfall)),
      };

      // specific check for NaN
      if (Object.values(payload).some(val => isNaN(val))) {
        throw new Error("Please ensure all fields are valid numbers.");
      }

      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();
      setPrediction(data.crop);
      setStep("result");
    } catch (err: unknown) { // 1. Change 'any' to 'unknown'
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate prediction.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to update form fields manually if extraction was imperfect
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setPrediction(null);
    setFormData({ n: "", p: "", k: "", ph: "", temperature: "", humidity: "", rainfall: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <Sprout className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold">Smart Crop Recommender</h1>
          <p className="text-emerald-100 mt-2">AI-driven insights for your soil</p>
        </div>

        <div className="p-8">
          {/* Progress Indicator */}
          <div className="flex justify-between mb-8 text-sm font-medium text-gray-500">
            <span className={step === 'upload' ? 'text-emerald-600' : ''}>1. Upload</span>
            <span className={step === 'review' ? 'text-emerald-600' : ''}>2. Review Data</span>
            <span className={step === 'result' ? 'text-emerald-600' : ''}>3. Result</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* --- VIEW 1: UPLOAD --- */}
          {step === "upload" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Location Input */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location (City)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    // Added 'text-gray-900' here to make the typed text dark and visible
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="e.g. Delhi, Mumbai"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center hover:bg-emerald-50 transition-colors cursor-pointer group relative">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {file ? file.name : "Upload Soil Health Card (PDF)"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {file ? "Click to change file" : "Drag & drop or click to browse"}
                  </p>
                </div>
              </div>

              <button 
                onClick={handleExtract}
                disabled={!file || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Analyze Soil Report"}
              </button>
            </div>
          )}

          {/* --- VIEW 2: REVIEW DATA --- */}
          {step === "review" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Review Extracted Data</h2>
              <p className="text-sm text-gray-500 mb-6">
                We extracted this data from your PDF and weather API. Please correct any missing or incorrect values before predicting.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <InputGroup label="Nitrogen (N)" name="n" val={formData.n} onChange={handleInputChange} icon="N" />
                <InputGroup label="Phosphorus (P)" name="p" val={formData.p} onChange={handleInputChange} icon="P" />
                <InputGroup label="Potassium (K)" name="k" val={formData.k} onChange={handleInputChange} icon="K" />
                <InputGroup label="pH Level" name="ph" val={formData.ph} onChange={handleInputChange} icon="pH" />
                
                <div className="col-span-2 border-t border-gray-100 my-2"></div>

                <InputGroup label="Temperature (°C)" name="temperature" val={formData.temperature} onChange={handleInputChange} Icon={ThermometerSun} />
                <InputGroup label="Humidity (%)" name="humidity" val={formData.humidity} onChange={handleInputChange} Icon={Droplets} />
                <InputGroup label="Rainfall (mm)" name="rainfall" val={formData.rainfall} onChange={handleInputChange} Icon={CloudRain} />
              </div>

              <button 
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Get Recommendation <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          )}

          {/* --- VIEW 3: RESULT --- */}
          {step === "result" && (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-12 h-12 text-green-600" />
              </div>
              
              <h2 className="text-gray-500 font-medium uppercase tracking-wide">Best Crop to Grow</h2>
              <h1 className="text-5xl font-extrabold text-emerald-800 mt-2 mb-6 capitalize">
                {prediction}
              </h1>

              <div className="bg-emerald-50 rounded-xl p-6 mb-8 text-left border border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Why this crop?
                </h3>
                <p className="text-emerald-800/80">
                  {`Based on your soil's NPK values (${formData.n}, ${formData.p}, ${formData.k}) 
                  and the current weather conditions in ${location},`} 
                  <span className="font-bold capitalize"> {prediction}</span> is the optimal choice for maximum yield.
                </p>
              </div>

              <button 
                onClick={handleReset}
                className="text-gray-500 hover:text-emerald-600 font-medium underline underline-offset-4"
              >
                Analyze another report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for inputs to keep code clean
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InputGroup({ label, name, val, onChange, icon, Icon }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-gray-400 font-bold w-5 h-5 flex items-center justify-center">
          {Icon ? <Icon className="w-4 h-4" /> : icon}
        </div>
        <input 
          type="number" 
          step="0.01"
          name={name}
          value={val}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-gray-700"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}