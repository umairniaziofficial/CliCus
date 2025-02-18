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
    <div className={`min-h-screen p-4 md:p-6 lg:p-8 ${theme.colors.surface} 
                   bg-gradient-to-br from-slate-50 to-slate-100
                   dark:from-slate-900 dark:to-slate-800`}>
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 
                   bg-gradient-to-r from-white to-white bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        GitHub Structure Explorer
      </motion.h1>

      <div className="flex flex-col md:flex-row items-center gap-4 max-w-7xl mx-auto">
        <div className="w-full md:flex-1">
          <SearchBar
            repoUrl={repoUrl}
            onUrlChange={setRepoUrl}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
        <BranchSelector
          branches={branches}
          selectedBranch={selectedBranch}
          onBranchChange={handleBranchChange}
        />
      </div>

      {error && (
        <motion.div 
          className={`text-${error.status === 404 ? 'red-500' : 'yellow-500'} 
                    my-4 text-center font-medium backdrop-blur-sm p-4 rounded-lg
                    border border-${error.status === 404 ? 'red-200' : 'yellow-200'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error.message}
        </motion.div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-7xl mx-auto mt-8">
        {structure && (
          <div className="w-full lg:w-1/3 xl:w-1/4">
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
    </div>
  );
}
