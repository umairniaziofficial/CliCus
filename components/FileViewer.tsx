import { LoadingSpinner } from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../utils/theme';

interface FileViewerProps {
  content: string | null;
  filename: string | null;
  isLoading: boolean;
}

export const FileViewer = ({ content, filename, isLoading }: FileViewerProps) => {
  if (!filename) {
    return (
      <motion.div
        className={`w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] 
                  flex items-center justify-center ${theme.colors.card} 
                  rounded-lg border ${theme.colors.border} backdrop-blur-sm bg-opacity-90`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className={`${theme.colors.textMuted} text-sm sm:text-base text-center px-4`}>
          Select a file to view its contents
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`w-full ${theme.colors.card} rounded-lg shadow-lg border 
                ${theme.colors.border} backdrop-blur-sm bg-opacity-90 overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`p-2 sm:p-3 border-b ${theme.colors.border} bg-gradient-to-r 
                  ${theme.colors.secondary} flex items-center justify-between`}
        layoutId={`header-${filename}`}
      >
        <h3 className="text-base sm:text-lg font-medium text-white truncate max-w-[80%]">
          {filename}
        </h3>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <LoadingSpinner size="small" color="blue-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={filename}
          className="p-2 sm:p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh]">
              <LoadingSpinner size="large" color="blue-600" />
            </div>
          ) : (
            <motion.pre
              className={`${theme.colors.surface} p-2 sm:p-4 rounded-lg overflow-x-auto 
                       text-xs sm:text-sm shadow-inner ${theme.colors.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <code className="font-mono break-words whitespace-pre-wrap">
                {content}
              </code>
            </motion.pre>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
