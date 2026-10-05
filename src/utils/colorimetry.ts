import { COLORIMETRY_CALIBRATION } from '../config/constants';
import { RGBColor, ScreeningStatus } from '../types';

export interface AnalysisCalculationResult {
  rgbZoneRaw: RGBColor;
  rgbRefRaw: RGBColor;
  rgbNormalized: RGBColor;
  chromaShift: number;
  status: ScreeningStatus;
  estimatedPpmRange: string;
  confidenceScore: number;
  explanation: string;
}

/**
 * Normalizes sample RGB with reference white card RGB to eliminate
 * ambient lighting bias (Kelvin color temperature & lux variations).
 */
export function normalizeRgb(sample: RGBColor, reference: RGBColor): RGBColor {
  // Prevent division by zero and handle very dark reference spots
  const refR = Math.max(reference.r, 20);
  const refG = Math.max(reference.g, 20);
  const refB = Math.max(reference.b, 20);

  const normR = Math.min(255, Math.round(sample.r * (255 / refR)));
  const normG = Math.min(255, Math.round(sample.g * (255 / refG)));
  const normB = Math.min(255, Math.round(sample.b * (255 / refB)));

  return { r: normR, g: normG, b: normB };
}

/**
 * Calculates weighted chromaticity distance (Delta Metric)
 * between the normalized test zone and the baseline blank test paper.
 */
export function calculateChromaShift(normalizedRgb: RGBColor): number {
  const baseline = COLORIMETRY_CALIBRATION.BASELINE_BLANK_STRIP;
  const weights = COLORIMETRY_CALIBRATION.SPECTRAL_WEIGHTS;

  const diffR = normalizedRgb.r - baseline.r;
  const diffG = normalizedRgb.g - baseline.g;
  const diffB = normalizedRgb.b - baseline.b;

  const weightedSum = 
    weights.R * Math.pow(diffR, 2) +
    weights.G * Math.pow(diffG, 2) +
    weights.B * Math.pow(diffB, 2);

  return Number(Math.sqrt(weightedSum).toFixed(1));
}

/**
 * Classifies colorimetry distance into ScreeningStatus & estimated PPM range.
 * Uses configurable thresholds defined in COLORIMETRY_CALIBRATION.
 */
export function evaluateColorimetry(
  sampleRgb: RGBColor,
  refRgb: RGBColor
): AnalysisCalculationResult {
  const rgbNormalized = normalizeRgb(sampleRgb, refRgb);
  const chromaShift = calculateChromaShift(rgbNormalized);

  let status: ScreeningStatus = 'negatif';
  let estimatedPpmRange = "< 1 ppm (Aman)";
  let confidenceScore = 94;
  let explanation = "";

  if (chromaShift <= COLORIMETRY_CALIBRATION.THRESHOLD_NEGATIVE_MAX) {
    status = 'negatif';
    estimatedPpmRange = "< 1 ppm (Batas Aman BPOM)";
    confidenceScore = 96;
    explanation = "Rona warna zona reaksi tidak menunjukkan pergeseran spektrum yang signifikan terhadap strip baseline. Nilai berada di bawah batas ambang deteksi kit.";
  } else if (chromaShift <= COLORIMETRY_CALIBRATION.THRESHOLD_FURTHER_TEST_MAX) {
    status = 'perlu_uji_lanjut';
    estimatedPpmRange = "1 – 10 ppm (Reaksi Samar)";
    confidenceScore = 78;
    explanation = "Terdeteksi pergeseran rona tingkat menengah. Perubahan ini bisa disebabkan oleh konsentrasi merkuri rendah atau interferensi pigmen bawaan produk kosmetik.";
  } else {
    status = 'terindikasi';
    if (chromaShift > 65) {
      estimatedPpmRange = "> 50 ppm (Konsentrasi Tinggi)";
      confidenceScore = 98;
    } else {
      estimatedPpmRange = "10 – 50 ppm (Reaksi Signifikan)";
      confidenceScore = 92;
    }
    explanation = "Terdeteksi pergeseran spektral kuat menuju spektrum merah-jingga kompleks ion kation Hg(II). Sampel terindikasi mengandung merkuri.";
  }

  return {
    rgbZoneRaw: sampleRgb,
    rgbRefRaw: refRgb,
    rgbNormalized,
    chromaShift,
    status,
    estimatedPpmRange,
    confidenceScore,
    explanation
  };
}

/**
 * Extracts average RGB from a specified rectangular/circular sub-region on a Canvas
 */
export function getAverageRgbFromCanvas(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number = 8
): RGBColor {
  const startX = Math.max(0, Math.floor(centerX - radius));
  const startY = Math.max(0, Math.floor(centerY - radius));
  const size = radius * 2;

  try {
    const imageData = ctx.getImageData(startX, startY, size, size);
    const data = imageData.data;
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
      count++;
    }

    if (count === 0) return { r: 240, g: 240, b: 240 };

    return {
      r: Math.round(totalR / count),
      g: Math.round(totalG / count),
      b: Math.round(totalB / count)
    };
  } catch (err) {
    console.error("Gagal membaca piksel canvas:", err);
    return { r: 240, g: 240, b: 240 };
  }
}

/**
 * Generates an illustrative procedural test strip canvas data URL
 * with authentic calibration target & reaction pad for instant demo testing
 */
export function generateSyntheticTestStrip(type: 'negative' | 'positive_strong' | 'borderline' | 'blank'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background white table surface with subtle texture
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle grid/shadow representing lab bench
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // 1. Reference White Calibration Card (Top-Left / Middle)
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  // White Card
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(60, 60, 220, 290, 8);
  ctx.fill();
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Reference Target Crosshair Area (Pure White target)
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.roundRect(85, 110, 170, 150, 6);
  ctx.fill();
  ctx.strokeStyle = '#94A3B8';
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Labels on White Card
  ctx.fillStyle = '#0F4C5C';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('MERCURY CALIBRATION', 85, 92);
  ctx.fillStyle = '#64748B';
  ctx.font = '10px monospace';
  ctx.fillText('KARTU REFERENSI PUTIH', 85, 135);
  ctx.fillText('REF WHITE AREA (99% R)', 85, 155);

  // Target mark in reference card
  ctx.strokeStyle = '#0F4C5C';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(170, 195, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(170 - 36, 195);
  ctx.lineTo(170 + 36, 195);
  ctx.moveTo(170, 195 - 36);
  ctx.lineTo(170, 195 + 36);
  ctx.stroke();

  ctx.restore();

  // 2. The Colorimetric Test Strip (Center-Right)
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  // Plastic strip body
  ctx.fillStyle = '#F1F5F9';
  ctx.beginPath();
  ctx.roundRect(330, 50, 240, 310, 10);
  ctx.fill();
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Strip brand & scale markings
  ctx.fillStyle = '#0F4C5C';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Hg TEST STRIP (KOLORIMETRI)', 350, 85);
  ctx.fillStyle = '#64748B';
  ctx.font = '10px monospace';
  ctx.fillText('LOT: MRC-2026-A01  EXP: 2027-10', 350, 105);

  // The Test Reaction Pad (Square/Circle area that changes color)
  let reactionColor = '#F2E4B9'; // Default blank
  let rimColor = '#E2D4A9';
  let padTitle = 'ZONA REAKSI';

  if (type === 'negative') {
    reactionColor = '#EEE0B4'; // Pale yellow/beige (no mercury)
    rimColor = '#E2D4A9';
    padTitle = 'REAKSI NEGATIF';
  } else if (type === 'positive_strong') {
    reactionColor = '#B8453D'; // Deep salmon red (mercury complex)
    rimColor = '#9A332C';
    padTitle = 'TERINDIKASI POSITIF';
  } else if (type === 'borderline') {
    reactionColor = '#E8A77E'; // Orange-pinkish borderline
    rimColor = '#C98A63';
    padTitle = 'REAKSI SAMAR';
  } else if (type === 'blank') {
    reactionColor = '#F2E4B9'; // Baseline
    rimColor = '#DECFA4';
    padTitle = 'BLANK KONTROL';
  }

  // Reaction zone frame
  ctx.fillStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.roundRect(380, 135, 140, 140, 8);
  ctx.fill();
  ctx.strokeStyle = '#CBD5E1';
  ctx.stroke();

  // Color reaction spot
  ctx.fillStyle = reactionColor;
  ctx.beginPath();
  ctx.arc(450, 205, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Small center crosshair
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(450, 205, 16, 0, Math.PI * 2);
  ctx.stroke();

  // Reaction Zone Label
  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(padTitle, 450, 305);
  ctx.font = '10px monospace';
  ctx.fillStyle = '#64748B';
  ctx.fillText('ZONA UJI KOLORIMETRI', 450, 322);

  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.95);
}
