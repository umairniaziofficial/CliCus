"use client";

import { useState } from 'react';
import { useGitHubRepo } from '../hooks/useGitHubRepo';
import { SearchBar } from '../components/SearchBar';
import { FileList } from '../components/FileList';
import { FileViewer } from '../components/FileViewer';
import { BranchSelector } from '../components/BranchSelector';
import { theme } from '../utils/theme';
import { motion } from 'framer-motion';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const { 
    structure, 
    isLoading, 
    error, 
    fileContent,
    branches,
    selectedBranch,
    setSelectedBranch,
    fetchRepoStructure,
    fetchFileContent
  } = useGitHubRepo();

  const handleSearch = () => {
    fetchRepoStructure(repoUrl);
    setSelectedFile(null);
  };

  const handleFileClick = async (path: string) => {
    setSelectedFile(path);
    setLoadingFile(path);
    const urlParts = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (urlParts) {
      try {
        await fetchFileContent(urlParts[1], urlParts[2], path);
      } finally {
        setLoadingFile(null);
      }
    }
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    if (repoUrl) {
      fetchRepoStructure(repoUrl);
    }
  };

  return (
    <div className={`min-h-screen ${theme.colors.surface} 
                   bg-gradient-radial from-[#1E293B] to-[#0F172A]
                   p-4 md:p-6 lg:p-8`}>
      <motion.div className={theme.utils.containerWidth}>
        <motion.h1 
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center 
                     mb-8 md:mb-12 bg-gradient-to-r ${theme.colors.primary} 
                     bg-clip-text text-transparent drop-shadow-2xl`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          GitHub Structure Explorer
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="w-full md:flex-1">
            <SearchBar {...{ repoUrl, onUrlChange: setRepoUrl, onSearch: handleSearch, isLoading }} />
          </div>
          <div className="w-full md:w-auto">
            <BranchSelector
              branches={branches}
              selectedBranch={selectedBranch}
              onBranchChange={handleBranchChange}
            />
          </div>
        </div>

        {error && (
          <motion.div 
            className={`mt-6 p-4 rounded-lg ${theme.utils.glassEffect}
                      border ${error.status === 404 ? theme.colors.error : theme.colors.warning}
                      text-center font-medium`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error.message}
          </motion.div>
        )}
        
        <div className="mt-8 flex flex-col lg:flex-row gap-6 items-start">
          {structure && (
            <div className="w-full lg:w-1/3 xl:w-1/4 lg:sticky lg:top-4">
              <FileList 
                items={structure} 
                onFileClick={handleFileClick}
                selectedFile={selectedFile}
                loadingFile={loadingFile}
              />
            </div>
          )}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <FileViewer 
              content={fileContent} 
              filename={selectedFile} 
              isLoading={loadingFile === selectedFile}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
