import { useState, ReactNode } from "react";
import { GitHubTreeItem } from "../types/github";
import { LoadingSpinner } from "./LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "../utils/theme";

interface FileListProps {
  items: GitHubTreeItem[];
  onFileClick: (path: string) => void;
  selectedFile: string | null;
  loadingFile: string | null;
}

interface TreeNode {
  name: string;
  path: string;
  type: "tree" | "blob";
  sha: string;
  children: { [key: string]: TreeNode };
}

export const FileList = ({
  items,
  onFileClick,
  selectedFile,
  loadingFile,
}: FileListProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const buildTree = (items: GitHubTreeItem[]): TreeNode => {
    const root: TreeNode = {
      name: "",
      path: "",
      type: "tree",
      sha: "",
      children: {},
    };

    items.forEach((item) => {
      const parts = item.path.split("/");
      let current = root;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current.children[part] = {
            name: part,
            path: item.path,
            type: item.type,
            sha: item.sha,
            children: {},
          };
        } else {
          if (!current.children[part]) {
            current.children[part] = {
              name: part,
              path: parts.slice(0, index + 1).join("/"),
              type: "tree",
              sha: "",
              children: {},
            };
          }
          current = current.children[part];
        }
      });
    });

    return root;
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: TreeNode, level: number = 0): ReactNode => {
    const isExpanded = expandedFolders.has(node.path);
    const indent = level * 12; // Reduced indent for mobile

    if (!node.name) {
      return Object.values(node.children).map(
        (child): ReactNode => renderNode(child, level)
      );
    }

    return (
      <motion.li
        key={`${node.path}-${node.sha}`}
        className="list-none marker:hidden" // Add this class
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={`py-1.5 sm:py-2 px-2 sm:px-3 font-mono text-xs sm:text-sm cursor-pointer
            backdrop-blur-sm bg-opacity-50
            hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent
            dark:hover:from-blue-900 dark:hover:to-transparent
            flex items-center gap-1.5 sm:gap-2 rounded-lg transition-all
            ${node.type === "tree" ? "font-medium" : ""}
            ${
              selectedFile === node.path
                ? "bg-gradient-to-r from-blue-100 to-transparent dark:from-blue-800 dark:to-transparent"
                : ""
            }`}
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() =>
            node.type === "tree"
              ? toggleFolder(node.path)
              : onFileClick(node.path)
          }
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.99 }}
        >
          <motion.span
            className="text-lg"
            animate={{ rotate: isExpanded && node.type === "tree" ? 90 : 0 }}
          >
            {node.type === "tree" ? (isExpanded ? "📂" : "📁") : "📄"}
          </motion.span>
          <span className="truncate">{node.name}</span>
          {loadingFile === node.path && (
            <LoadingSpinner size="small" color="blue-600" />
          )}
        </motion.div>
        <AnimatePresence>
          {node.type === "tree" && isExpanded && (
            <motion.ul
              className="m-0 relative before:absolute before:left-3 sm:before:left-4 
                       before:top-0 before:bottom-0 before:w-px 
                       before:bg-gradient-to-b before:from-blue-200 before:to-transparent
                       dark:before:from-blue-700 list-none marker:hidden" // Updated class
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {Object.values(node.children).map((child) =>
                renderNode(child, level + 1)
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.li>
    );
  };

  return (
    <motion.div
      className={`${theme.colors.card} rounded-lg shadow-lg border ${theme.colors.border} 
                backdrop-blur-sm bg-opacity-90 overflow-hidden h-[calc(100vh-16rem)] sm:h-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`p-2 sm:p-3 border-b ${theme.colors.border} 
                    bg-gradient-to-r ${theme.colors.primary}`}
      >
        <h3 className="text-base sm:text-lg font-medium text-white">
          Repository Files
        </h3>
      </div>
      <div
        className="p-1 sm:p-2 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto 
                    scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent"
      >
        <ul className="list-none marker:hidden p-0 m-0">
          {renderNode(buildTree(items))}
        </ul>
      </div>
    </motion.div>
  );
};
