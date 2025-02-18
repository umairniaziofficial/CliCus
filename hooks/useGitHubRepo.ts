import { useState, useCallback } from 'react';
import axios from 'axios';
import { CacheService } from '../utils/cache';
import type { GitHubTreeItem, GitHubTreeResponse, GitHubError, GitHubFileContent, GitHubBranch } from '../types/github';

export const useGitHubRepo = () => {
  const [structure, setStructure] = useState<GitHubTreeItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GitHubError | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const cache = CacheService.getInstance();

  const validateGithubUrl = (url: string): [string, string] | null => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    return match ? [match[1], match[2]] : null;
  };

  const getCacheKey = (type: string, owner: string, repo: string, path: string = '', branch: string = 'main'): string => {
    return `github_${type}_${owner}_${repo}_${branch}_${path}`.toLowerCase();
  };

  const fetchBranches = useCallback(async (owner: string, repo: string) => {
    const cacheKey = getCacheKey('branches', owner, repo);
    const cachedData = cache.get<GitHubBranch[]>(cacheKey);

    if (cachedData) {
      setBranches(cachedData);
      return;
    }

    try {
      const response = await axios.get<GitHubBranch[]>(
        `https://api.github.com/repos/${owner}/${repo}/branches`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
        }
      );
      cache.set(cacheKey, response.data);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  }, [cache]);

  const fetchFileContent = async (owner: string, repo: string, path: string) => {
    const cacheKey = getCacheKey('content', owner, repo, path, selectedBranch);
    const cachedContent = cache.get<string>(cacheKey);

    if (cachedContent) {
      setFileContent(cachedContent);
      return cachedContent;
    }

    try {
      const response = await axios.get<GitHubFileContent>(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${selectedBranch}`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
        }
      );
      const content = atob(response.data.content);
      cache.set(cacheKey, content);
      setFileContent(content);
      return content;
    } catch (error) {
      console.error('Error fetching file content:', error);
      setFileContent(null);
      return null;
    }
  };

  const fetchRepoStructure = useCallback(async (repoUrl: string) => {
    setError(null);
    setIsLoading(true);
    setFileContent(null);

    try {
      const urlParts = validateGithubUrl(repoUrl);
      if (!urlParts) {
        throw new Error("Please enter a valid GitHub repository URL");
      }

      const [owner, repo] = urlParts;
      const cacheKey = getCacheKey('structure', owner, repo, '', selectedBranch);
      const cachedStructure = cache.get<GitHubTreeItem[]>(cacheKey);

      if (cachedStructure) {
        setStructure(cachedStructure);
        await fetchBranches(owner, repo);
        return;
      }

      const response = await axios.get<GitHubTreeResponse>(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${selectedBranch}?recursive=1`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
        }
      );

      cache.set(cacheKey, response.data.tree);
      setStructure(response.data.tree);
      
      if (response.data.truncated) {
        setError({ message: "Warning: Repository too large, showing partial structure" });
      }
      
      await fetchBranches(owner, repo);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError({
          message: error.response?.status === 404
            ? "Repository not found or private"
            : error.response?.status === 403
            ? "API rate limit exceeded. Please try again later."
            : error.message,
          status: error.response?.status
        });
      } else {
        setError({ message: "An unexpected error occurred" });
      }
      setStructure(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch, cache, fetchBranches]);

  // Clear cache when switching branches
  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    cache.clear(); // Optional: clear only related cache entries instead of all
  };

  return {
    structure,
    isLoading,
    error,
    fileContent,
    branches,
    selectedBranch,
    setSelectedBranch,
    fetchRepoStructure,
    fetchFileContent,
    handleBranchChange
  };
};
