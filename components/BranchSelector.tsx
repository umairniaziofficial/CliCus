import { GitHubBranch } from '../types/github';
import { theme } from '../utils/theme';
import { motion } from 'framer-motion';

interface BranchSelectorProps {
  branches: GitHubBranch[];
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}

export const BranchSelector = ({ branches, selectedBranch, onBranchChange }: BranchSelectorProps) => {
  if (branches.length === 0) return null;

  return (
    <motion.div
      className="relative min-w-[150px]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <select
        value={selectedBranch}
        onChange={(e) => onBranchChange(e.target.value)}
        className={`w-full p-2.5 pl-4 pr-10 ${theme.colors.input} ${theme.colors.text}
                 border ${theme.colors.border} rounded-lg appearance-none cursor-pointer
                 ${theme.utils.glassEffect} ${theme.utils.hoverTransition} ${theme.utils.focusRing}
                 ${theme.colors.cardHover}`}
      >
        {branches.map((branch) => (
          <option 
            key={branch.name} 
            value={branch.name}
            className={`${theme.colors.card} ${theme.colors.text}`}
          >
            {branch.name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </motion.div>
  );
};
