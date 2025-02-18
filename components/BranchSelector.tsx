import { GitHubBranch } from '../types/github';

interface BranchSelectorProps {
  branches: GitHubBranch[];
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}

export const BranchSelector = ({ branches, selectedBranch, onBranchChange }: BranchSelectorProps) => {
  if (branches.length === 0) return null;

  return (
    <select
      value={selectedBranch}
      onChange={(e) => onBranchChange(e.target.value)}
      className="p-2 border rounded"
    >
      {branches.map((branch) => (
        <option key={branch.name} value={branch.name}>
          {branch.name}
        </option>
      ))}
    </select>
  );
};
