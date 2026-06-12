import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Settings, Upload, Image as ImageIcon } from 'lucide-react';
import type { ProjectConfig } from './types';
import { AdPlaceholder } from './components/AdPlaceholder';
import { SupportButtons } from './components/MonetizationLinks';
import { Visualizer } from './components/Visualizer';
import { ColorInventory } from './components/ColorInventory';
import { processImage, type ProcessedResult } from './lib/imageProcessor';
import { generatePDF } from './lib/pdfGenerator';

const DEFAULT_CONFIG: ProjectConfig = {
  modality: 'diamond',
  canvasWidthInches: 10,
  canvasHeightInches: 10,
  unitsPerInch: 10, // Default 10 drills/inch for diamond art
  maxColors: 0, // 0 = unlimited
};

function App() {
  const [config, setConfig] = useState<ProjectConfig>(DEFAULT_CONFIG);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedResult | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const aspect = config.canvasWidthInches / config.canvasHeightInches;

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (_e: React.SyntheticEvent<HTMLImageElement>) => {
    // Auto center crop based on aspect ratio
    let cw = 80;
    let ch = cw / aspect;
    if (ch > 100) {
        ch = 80;
        cw = ch * aspect;
    }

    const initialCrop: Crop = {
        unit: '%',
        width: cw,
        height: ch,
        x: (100 - cw) / 2,
        y: (100 - ch) / 2
    };

    setCrop(initialCrop);
  };

  useEffect(() => {
    if (imgRef.current && crop) {
      // Re-adjust crop when aspect changes
      let cw = crop.width;
      let ch = cw / aspect;
      if (crop.unit === '%' && ch > 100) {
          ch = 80;
          cw = ch * aspect;
      }
      setCrop(prev => prev ? { ...prev, width: cw, height: ch } : prev);
    }
  }, [aspect]);

  const handleModalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modality = e.target.value as ProjectConfig['modality'];
    let unitsPerInch = config.unitsPerInch;

    if (modality === 'diamond') unitsPerInch = 10; // Standard drills are 2.5mm (~10 per inch)
    else if (modality === 'crossstitch') unitsPerInch = 14; // Default to 14 count Aida
    else if (modality === 'perler') unitsPerInch = 5; // Standard 5mm beads (~5 per inch)
    else if (modality === 'lego') unitsPerInch = 3; // Standard 8mm studs (~3.2 per inch)

    setConfig(prev => ({ ...prev, modality, unitsPerInch }));
  };

  const handleProcess = async () => {
    if (!imgRef.current || !completedCrop) return;
    setIsProcessing(true);

    const targetWidthPixels = config.canvasWidthInches * config.unitsPerInch;
    const targetHeightPixels = config.canvasHeightInches * config.unitsPerInch;

    // Allow UI to update loading state
    setTimeout(async () => {
      try {
        const result = await processImage(
          imgRef.current!,
          completedCrop,
          targetWidthPixels,
          targetHeightPixels,
          config.modality
        );
        setProcessedData(result);
      } catch (err) {
        console.error("Failed to process image", err);
        alert("Failed to process image. See console for details.");
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-white shadow-sm py-4 px-6 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon className="text-blue-600" />
          PixelatePro
        </h1>
      </header>

      <main className="w-full max-w-6xl px-4 flex flex-col gap-8">
        <AdPlaceholder className="w-full max-w-4xl mx-auto" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Configuration Sidebar */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-6 lg:col-span-1 h-fit">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <Settings size={20} /> Project Settings
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Style / Modality</label>
              <select
                value={config.modality}
                onChange={handleModalityChange}
                className="p-2 border rounded-md bg-gray-50"
              >
                <option value="diamond">Diamond Art (10 drills/inch)</option>
                <option value="crossstitch">Cross-stitch (14 ct Aida)</option>
                <option value="perler">Perler Beads (5mm)</option>
                <option value="lego">Lego Art (8mm studs)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Width (inches)</label>
                <input
                  type="number"
                  min={1} max={50}
                  value={config.canvasWidthInches}
                  onChange={e => setConfig(prev => ({ ...prev, canvasWidthInches: Number(e.target.value) || 1 }))}
                  className="p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Height (inches)</label>
                <input
                  type="number"
                  min={1} max={50}
                  value={config.canvasHeightInches}
                  onChange={e => setConfig(prev => ({ ...prev, canvasHeightInches: Number(e.target.value) || 1 }))}
                  className="p-2 border rounded-md bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" title="Pixels/Drills/Stitches per inch">
                  Density
                </label>
                <input
                  type="number"
                  min={1} max={50}
                  value={config.unitsPerInch}
                  onChange={e => setConfig(prev => ({ ...prev, unitsPerInch: Number(e.target.value) || 1 }))}
                  className="p-2 border rounded-md bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700" title="Max distinct colors (0 for unlimited)">
                  Max Colors
                </label>
                <input
                  type="number"
                  min={0} max={100}
                  value={config.maxColors || ''}
                  placeholder="Unlimited"
                  onChange={e => setConfig(prev => ({ ...prev, maxColors: Number(e.target.value) || 0 }))}
                  className="p-2 border rounded-md bg-gray-50"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-[-10px]">
              Grid size will be: {config.canvasWidthInches * config.unitsPerInch} x {config.canvasHeightInches * config.unitsPerInch} pixels.
            </p>

            <div className="mt-4 pt-4 border-t flex flex-col gap-4">
              <label className="flex items-center justify-center gap-2 w-full p-3 bg-blue-50 text-blue-700 font-semibold rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200">
                <Upload size={20} />
                Upload Image
                <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
              </label>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2 flex flex-col items-center justify-center min-h-[500px]">
            {!imgSrc ? (
              <div className="text-center text-gray-400 flex flex-col items-center gap-4">
                <ImageIcon size={64} className="opacity-50" />
                <p>Upload an image to start cropping and pixelating.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <h3 className="font-semibold text-gray-700 self-start">Step 1: Crop Image</h3>
                <p className="text-sm text-gray-500 self-start">
                  Select the area you want to convert. The selection box is locked to your chosen canvas aspect ratio ({config.canvasWidthInches}" x {config.canvasHeightInches}").
                </p>

                <div className="max-h-[600px] overflow-auto border bg-gray-100 w-full flex justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-w-full"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      className="max-h-[600px] object-contain"
                    />
                  </ReactCrop>
                </div>

                  <button
                    onClick={handleProcess}
                    disabled={!completedCrop || isProcessing}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isProcessing ? 'Processing...' : 'Generate Pattern'}
                  </button>
              </div>
            )}
          </div>
        </div>

          {processedData && (
            <div className="w-full flex flex-col gap-8 mt-8 border-t pt-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Step 2: Preview & Export</h2>
                <button
                  onClick={async () => {
                    setIsGeneratingPDF(true);
                    // Use setTimeout to allow the UI to update to the "Generating..." state
                    setTimeout(async () => {
                      try {
                        await generatePDF(processedData);
                      } finally {
                        setIsGeneratingPDF(false);
                      }
                    }, 50);
                  }}
                  disabled={isGeneratingPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow disabled:opacity-50"
                >
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Pattern'}
                </button>
              </div>
              <Visualizer data={processedData} />
              <ColorInventory data={processedData} modality={config.modality} />
            </div>
          )}

        <SupportButtons />
        <AdPlaceholder className="w-full max-w-4xl mx-auto mb-16" />
      </main>
    </div>
  );
}

export default App;
