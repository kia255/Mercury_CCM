import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  Sliders, 
  Layers, 
  Crosshair, 
  FileCheck2,
  Sparkles 
} from 'lucide-react';
import { PaperSource, ProductItem } from '../../types';
import { 
  COLORIMETRY_CALIBRATION, 
  STATUS_CONFIG, 
  GLOBAL_DISCLAIMER 
} from '../../config/constants';
import { 
  AnalysisCalculationResult, 
  evaluateColorimetry, 
  getAverageRgbFromCanvas, 
  generateSyntheticTestStrip 
} from '../../utils/colorimetry';
import { StatusBadge } from '../common/StatusBadge';
import { UploadResultModal } from './UploadResultModal';
import { MercuryMascot } from '../illustrations/MercuryMascot';
import { MercuryLogo } from '../common/MercuryLogo';

interface ScanViewProps {
  onProductCreated: (newProduct: ProductItem) => void;
  onNavigateToDatabase: () => void;
}

export const ScanView: React.FC<ScanViewProps> = ({
  onProductCreated,
  onNavigateToDatabase
}) => {
  const [step, setStep] = useState<number>(1);
  const [paperSource, setPaperSource] = useState<PaperSource>('mercury');
  const [batchCode, setBatchCode] = useState('MRC-2026-A01');

  const [imageSrc, setImageSrc] = useState<string>('');
  const [presetName, setPresetName] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [refPoint, setRefPoint] = useState<{ x: number; y: number }>({ x: 170, y: 195 });
  const [samplePoint, setSamplePoint] = useState<{ x: number; y: number }>({ x: 450, y: 205 });
  const [activePin, setActivePin] = useState<'sample' | 'ref'>('sample');

  const [analysisResult, setAnalysisResult] = useState<AnalysisCalculationResult | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadPreset('negative', 'Krim Contoh A (Aman / Tidak Terdeteksi)');
  }, []);

  const loadPreset = (type: 'negative' | 'positive_strong' | 'borderline' | 'blank', label: string) => {
    const url = generateSyntheticTestStrip(type);
    setImageSrc(url);
    setPresetName(label);
    setRefPoint({ x: 170, y: 195 });
    setSamplePoint({ x: 450, y: 205 });

    setTimeout(() => {
      runCodeBasedAnalysis(url, { x: 170, y: 195 }, { x: 450, y: 205 });
    }, 150);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setImageSrc(url);
      setPresetName('Foto Unggahan');
      setTimeout(() => {
        runCodeBasedAnalysis(url, refPoint, samplePoint);
      }, 150);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert("Kamera tidak dapat diakses. Kamu bisa unggah foto atau klik preset simulasi di bawah.");
      setIsCameraActive(false);
    }
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth || 640;
    tempCanvas.height = video.videoHeight || 480;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
      const dataUrl = tempCanvas.toDataURL('image/jpeg');
      setImageSrc(dataUrl);
      setPresetName('Foto Kamera');
      stopCamera();
      setTimeout(() => {
        runCodeBasedAnalysis(dataUrl, { x: 160, y: 200 }, { x: 400, y: 200 });
      }, 150);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const runCodeBasedAnalysis = (
    imgUrl: string, 
    customRefPt = refPoint, 
    customSamplePt = samplePoint
  ) => {
    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;

    img.onload = () => {
      canvas.width = img.width || 640;
      canvas.height = img.height || 420;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const clampedRefX = Math.min(Math.max(customRefPt.x, 15), canvas.width - 15);
      const clampedRefY = Math.min(Math.max(customRefPt.y, 15), canvas.height - 15);
      const clampedSampleX = Math.min(Math.max(customSamplePt.x, 15), canvas.width - 15);
      const clampedSampleY = Math.min(Math.max(customSamplePt.y, 15), canvas.height - 15);

      const refRgb = getAverageRgbFromCanvas(ctx, clampedRefX, clampedRefY, 10);
      const sampleRgb = getAverageRgbFromCanvas(ctx, clampedSampleX, clampedSampleY, 10);

      const result = evaluateColorimetry(sampleRgb, refRgb);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = Math.round((e.clientX - rect.left) * scaleX);
    const clickY = Math.round((e.clientY - rect.top) * scaleY);

    if (activePin === 'sample') {
      setSamplePoint({ x: clickX, y: clickY });
      runCodeBasedAnalysis(imageSrc, refPoint, { x: clickX, y: clickY });
    } else {
      setRefPoint({ x: clickX, y: clickY });
      runCodeBasedAnalysis(imageSrc, { x: clickX, y: clickY }, samplePoint);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Scan Kertas Uji Skincare
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Arahkan kamera ke kertas uji dan kartu putih untuk membaca hasilnya.
        </p>

        {/* Step Tabs (Modern & rounded) */}
        <div className="flex items-center justify-center gap-2 pt-3">
          <button
            onClick={() => setStep(1)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              step === 1 ? 'bg-[#0F4C5C] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            1. Sumber Kertas
          </button>
          <button
            onClick={() => setStep(2)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              step === 2 ? 'bg-[#0F4C5C] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            2. Panduan Foto
          </button>
          <button
            onClick={() => setStep(3)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              step === 3 ? 'bg-[#0F4C5C] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            3. Hasil Scan
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: PILIH SUMBER KERTAS */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 bg-teal-50/70 p-4 rounded-2xl">
            <MercuryMascot mood="happy" size={44} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Siapkan kertas ujimu ya. Mau pakai kit resmi MERCURY atau kertas mandiri lainnya, dua-duanya bisa discan di sini!
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-800">Kertas mana yang kamu pakai?</h3>
            <p className="text-xs text-slate-500 font-medium">
              Pilih salah satu di bawah ini:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              onClick={() => setPaperSource('mercury')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                paperSource === 'mercury'
                  ? 'border-[#0F4C5C] bg-teal-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <MercuryLogo variant="mark" size={20} />
                  <span className="text-[11px] font-extrabold uppercase text-[#0F4C5C]">Kit Resmi</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paperSource === 'mercury' ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white' : 'border-slate-300'}`}>
                  {paperSource === 'mercury' && <Check size={10} />}
                </div>
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">Kit MERCURY</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Sudah termasuk kartu referensi standar. Hasil tes berbobot tinggi di komunitas.
              </p>

              {paperSource === 'mercury' && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Kode Batch:</label>
                  <input
                    type="text"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                    className="w-full text-xs font-mono px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              )}
            </div>

            <div
              onClick={() => setPaperSource('lainnya')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                paperSource === 'lainnya'
                  ? 'border-[#0F4C5C] bg-teal-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase text-slate-500">Sumber Lain</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paperSource === 'lainnya' ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white' : 'border-slate-300'}`}>
                  {paperSource === 'lainnya' && <Check size={10} />}
                </div>
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">Kertas Lain</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kertas uji mandiri dari merek lain. Tetap bisa discan dengan meletakkannya di atas kertas putih.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479] transition-all"
            >
              <span>Lanjut ke Panduan Foto</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PANDUAN FOTO */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 bg-teal-50/70 p-4 rounded-2xl">
            <MercuryMascot mood="wave" size={44} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Cek tips ini sebentar ya! Yang paling penting: jangan nyalakan flash dan pakai latar putih polos.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-800">4 Tips Foto yang Jelas</h3>
            <p className="text-xs text-slate-500 font-medium">
              Supaya warnanya terbaca pas, pastikan fotomu mengikuti panduan ini:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#F0FDF9] border border-teal-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-0.5">Cahaya Cukup & Terang</h4>
                <p className="text-xs text-slate-600">Gunakan sinar matahari ruangan atau lampu terang merata.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0FDF9] border border-teal-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-0.5">Jangan Pakai Flash</h4>
                <p className="text-xs text-slate-600">Kilatan blitz bikin pantulan silau yang merusak warna.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0FDF9] border border-teal-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-0.5">Latar Putih Polos</h4>
                <p className="text-xs text-slate-600">Alasi dengan kertas HVS atau meja putih bersih.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0FDF9] border border-teal-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-0.5">Kartu Putih Terlihat</h4>
                <p className="text-xs text-slate-600">Pastikan kartu referensi dan lingkaran tes terlihat satu bingkai.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Kembali
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479] transition-all"
            >
              <span>Mulai Ambil Foto</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: ANALISIS KODE & HASIL SCAN */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="space-y-6">
          
          {/* Preset Buttons for One-Click Demo Testing */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Coba Contoh Hasil Tes (1 Klik)
              </span>
              <span className="text-[11px] text-slate-400">Pilih salah satu sampel di bawah:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => loadPreset('negative', 'Krim Contoh A (Aman / Tidak Terdeteksi)')}
                className="p-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 text-left text-xs hover:bg-emerald-100/70 transition-colors"
              >
                <div className="font-extrabold text-emerald-800">Contoh: Aman</div>
                <div className="text-[10px] text-emerald-600">Warna reagen normal</div>
              </button>

              <button
                onClick={() => loadPreset('positive_strong', 'Krim Contoh B (Terindikasi Merkuri)')}
                className="p-2.5 rounded-2xl border border-rose-200 bg-rose-50 text-left text-xs hover:bg-rose-100/70 transition-colors"
              >
                <div className="font-extrabold text-rose-800">Contoh: Terindikasi</div>
                <div className="text-[10px] text-rose-600">Warna merah salmon</div>
              </button>

              <button
                onClick={() => loadPreset('borderline', 'Krim Contoh C (Perlu Uji Lanjut)')}
                className="p-2.5 rounded-2xl border border-amber-200 bg-amber-50 text-left text-xs hover:bg-amber-100/70 transition-colors"
              >
                <div className="font-extrabold text-amber-800">Contoh: Uji Lanjut</div>
                <div className="text-[10px] text-amber-600">Reaksi samar</div>
              </button>

              <button
                onClick={() => loadPreset('blank', 'Blank Strip (Kontrol Kertas Kosong)')}
                className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-left text-xs hover:bg-slate-100 transition-colors"
              >
                <div className="font-extrabold text-slate-800">Kertas Kosong</div>
                <div className="text-[10px] text-slate-500">Sebelum kena sampel</div>
              </button>
            </div>
          </div>

          {/* Main 2-Column: Left = Canvas & Pin Picker, Right = Result & Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Canvas */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Titik Pembacaan Kertas</h3>
                  <p className="text-[11px] text-slate-500">Ketuk gambar untuk memindahkan target.</p>
                </div>

                <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 text-xs">
                  <button
                    onClick={() => setActivePin('sample')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      activePin === 'sample' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Zona Uji
                  </button>
                  <button
                    onClick={() => setActivePin('ref')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      activePin === 'ref' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Ref Putih
                  </button>
                </div>
              </div>

              {/* Live camera view */}
              {isCameraActive && (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                  <div className="absolute bottom-4 flex gap-3">
                    <button
                      onClick={captureCameraFrame}
                      className="px-6 py-2.5 rounded-full bg-[#E8837A] text-white font-bold text-xs shadow-lg flex items-center gap-2"
                    >
                      <Camera size={16} />
                      <span>Ambil Gambar</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-full bg-slate-800 text-white text-xs font-semibold"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* Interactive Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center min-h-[280px]">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="max-w-full h-auto object-contain cursor-crosshair shadow-inner"
                />

                {canvasRef.current && (
                  <>
                    <div
                      className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{
                        left: `${(samplePoint.x / canvasRef.current.width) * 100}%`,
                        top: `${(samplePoint.y / canvasRef.current.height) * 100}%`
                      }}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-rose-500 bg-rose-500/30 flex items-center justify-center shadow-md animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
                      </div>
                      <span className="bg-rose-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">
                        Zona Uji
                      </span>
                    </div>

                    <div
                      className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{
                        left: `${(refPoint.x / canvasRef.current.width) * 100}%`,
                        top: `${(refPoint.y / canvasRef.current.height) * 100}%`
                      }}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-sky-500 bg-sky-500/30 flex items-center justify-center shadow-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-600"></div>
                      </div>
                      <span className="bg-sky-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">
                        Ref Putih
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Upload & Camera Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500 truncate max-w-xs">{presetName}</span>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Upload size={14} />
                    <span>Unggah Foto</span>
                  </button>

                  <button
                    onClick={startCamera}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Camera size={14} />
                    <span>Kamera</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Results Display */}
            <div className="lg:col-span-5 space-y-4">
              {analysisResult && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                  
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Hasil Pembacaan Kertas
                    </span>
                    <div>
                      <StatusBadge status={analysisResult.status} size="prominent" />
                    </div>
                  </div>

                  {/* Mascot friendly feedback */}
                  <div className={`p-4 rounded-2xl flex items-center gap-3.5 ${analysisResult.status === 'terindikasi' ? 'bg-rose-50 text-rose-900' : analysisResult.status === 'negatif' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
                    <MercuryMascot 
                      mood={analysisResult.status === 'terindikasi' ? 'alert' : analysisResult.status === 'negatif' ? 'celebrate' : 'curious'} 
                      size={44} 
                      className="flex-shrink-0" 
                    />
                    <p className="text-xs font-semibold leading-relaxed">
                      {analysisResult.status === 'terindikasi' 
                        ? 'Waduh, kertas ujinya berubah merah salmon! Terindikasi merkuri, jangan dipakai di kulit ya.'
                        : analysisResult.status === 'negatif'
                        ? 'Keren! Kertas uji tetap kuning normal, tidak terdeteksi merkuri pada sampel ini.'
                        : 'Warnanya agak samar, mungkin terpengaruh pigmen skincare. Disarankan coba tes ulang ya.'}
                    </p>
                  </div>

                  {/* Swatches & Values */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Warna Terdeteksi</span>
                      <span className="font-mono text-[11px] text-slate-500">ΔE {analysisResult.chromaShift}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                        <div 
                          className="w-7 h-7 rounded-lg border border-slate-300 shadow-inner flex-shrink-0"
                          style={{
                            backgroundColor: `rgb(${analysisResult.rgbRefRaw.r}, ${analysisResult.rgbRefRaw.g}, ${analysisResult.rgbRefRaw.b})`
                          }}
                        />
                        <div className="text-[10px] text-slate-600">
                          <div>Ref Putih</div>
                          <div className="font-mono font-bold text-slate-800">
                            {analysisResult.rgbRefRaw.r},{analysisResult.rgbRefRaw.g},{analysisResult.rgbRefRaw.b}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                        <div 
                          className="w-7 h-7 rounded-lg border border-slate-300 shadow-inner flex-shrink-0"
                          style={{
                            backgroundColor: `rgb(${analysisResult.rgbNormalized.r}, ${analysisResult.rgbNormalized.g}, ${analysisResult.rgbNormalized.b})`
                          }}
                        />
                        <div className="text-[10px] text-slate-600">
                          <div>Warna Ternormalisasi</div>
                          <div className="font-mono font-bold text-[#0F4C5C]">
                            {analysisResult.rgbNormalized.r},{analysisResult.rgbNormalized.g},{analysisResult.rgbNormalized.b}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explanation text */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {analysisResult.explanation}
                  </p>

                  {/* Button to Upload to Community */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#E8837A] hover:bg-[#D96F65] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <FileCheck2 size={18} />
                      <span>Simpan ke Hasil Tes Komunitas</span>
                    </button>

                    <button
                      onClick={() => setStep(1)}
                      className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold hover:bg-slate-100"
                    >
                      Uji Ulang / Ganti Sampel
                    </button>
                  </div>

                  {/* Compact One-Line Disclaimer */}
                  <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
                    ⚠️ {GLOBAL_DISCLAIMER}
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {analysisResult && (
        <UploadResultModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          analysis={analysisResult}
          paperSource={paperSource}
          batchCode={batchCode}
          photoUrl={imageSrc}
          onSaveSuccess={(newProd) => {
            onProductCreated(newProd);
            onNavigateToDatabase();
          }}
        />
      )}

    </div>
  );
};
