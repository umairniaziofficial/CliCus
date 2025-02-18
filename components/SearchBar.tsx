import { LoadingSpinner } from "./LoadingSpinner";
import { motion } from "framer-motion";
import { theme } from "../utils/theme";

interface SearchBarProps {
  repoUrl: string;
  onUrlChange: (url: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchBar = ({
  repoUrl,
  onUrlChange,
  onSearch,
  isLoading,
}: SearchBarProps) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.input
        type="text"
        value={repoUrl}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="Enter GitHub repo URL"
        className={`flex-1 p-2 sm:p-3 text-sm sm:text-base border ${theme.colors.border} rounded-lg
                 shadow-sm backdrop-blur-sm bg-opacity-90 ${theme.colors.card}
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-all duration-200 outline-none ${theme.colors.text}`}
        disabled={isLoading}
        whileFocus={{ scale: 1.01 }}
      />
      <motion.button
        onClick={onSearch}
        disabled={isLoading}
        className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white
              bg-gradient-to-r from-blue-700 to-cyan-400 border border-white/20 rounded-lg
              hover:brightness-110 active:brightness-90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 shadow-lg hover:shadow-xl
              whitespace-nowrap`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LoadingSpinner size="small" />
            <span>Loading...</span>
          </motion.div>
        ) : (
          "Fetch Structure"
        )}
      </motion.button>
    </motion.div>
  );
};
