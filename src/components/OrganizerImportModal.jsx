import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Label, Textarea, FormError, FormHelper } from './ui/FormControls';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { teamDirectoryService } from '../services/teamDirectoryService';

export function OrganizerImportModal({ isOpen, onClose, onImportSuccess }) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputText(content);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the selected file. Please try pasting the text directly.');
    };
    reader.readAsText(file);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please provide team names or upload a CSV file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await teamDirectoryService.importRound2Teams(inputText);
      setSuccessMsg(`Successfully imported ${result.count} team names into the Round 2 directory.`);
      if (onImportSuccess) {
        onImportSuccess(result.teams);
      }
    } catch (err) {
      setError(err.message || 'Failed to process team names.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetToOfficial = () => {
    const teams = teamDirectoryService.resetRound2Teams();
    setSuccessMsg('Reset Round 2 roster to initial organizer-supplied teams (100 teams).');
    setInputText('');
    setError(null);
    if (onImportSuccess) {
      onImportSuccess(teams);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccessMsg(null);
    setInputText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Organizer Roster Import"
      description="Import or update official team names for Round 2 via CSV or line-by-line text."
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{successMsg}</p>
              <p className="text-emerald-700 mt-0.5">Directory has been updated in real-time.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* File Drag/Drop or Input */}
        <div>
          <Label htmlFor="csvFile">Upload CSV / Text File</Label>
          <div className="relative border-2 border-dashed border-slate-300 hover:border-primary-500 rounded-lg p-4 text-center cursor-pointer transition-colors bg-slate-50">
            <input
              id="csvFile"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500 text-xs">
              <UploadCloud className="w-6 h-6 text-primary-600" />
              <span className="font-semibold text-slate-800">Click or drag a .csv or .txt file here</span>
              <span className="text-[11px] text-slate-500 font-mono">Format: One team name per line, or single column CSV</span>
            </div>
          </div>
        </div>

        {/* Direct Text Input */}
        <div>
          <Label htmlFor="rawTextInput">Or Paste Team Names</Label>
          <Textarea
            id="rawTextInput"
            rows={5}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError(null);
            }}
            placeholder={"Paradox\nApex Geospatial\nAltitude AI\n..."}
            className="font-mono text-xs bg-white text-slate-900 border-slate-300"
          />
          <FormHelper>
            Headers like "Team Name" are automatically recognized and stripped. Empty lines are ignored.
          </FormHelper>
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetToOfficial}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Reset to Confirmed 100
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Done
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleImport}
              isLoading={isProcessing}
            >
              Apply Team Roster
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
