import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Globe, Folder } from 'lucide-react';

const BookmarkItem = ({ bookmark }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getFaviconUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  // If it's a folder
  if (!bookmark.url) {
    return (
      <div>
        <div 
          className="flex items-center py-2 px-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 
            <ChevronDown className="w-4 h-4 text-gray-400 mr-2" /> :
            <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
          }
          <Folder className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="text-sm truncate">{bookmark.title}</span>
          {bookmark.children && (
            <span className="text-xs text-gray-400 ml-2">
              ({bookmark.children.length})
            </span>
          )}
        </div>
        {isExpanded && bookmark.children && (
          <div className="ml-4">
            {bookmark.children.map((child) => (
              <BookmarkItem key={child.id} bookmark={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // If it's a bookmark
  return (
    
    <a  href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center py-2 px-4 hover:bg-gray-50 group"
    >
      <div className="relative w-4 h-4 flex-shrink-0 mr-2">
        <img 
          src={getFaviconUrl(bookmark.url)}
          className="w-4 h-4 object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'block';
          }}
        />
        <Globe 
          className="w-4 h-4 text-blue-500 absolute top-0 left-0 hidden"
        />
      </div>
      <span className="text-sm truncate">{bookmark.title || bookmark.url}</span>
    </a>
  );
};

const BookmarksList = ({ searchTerm }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    chrome.bookmarks.getTree((tree) => {
      // Get all bookmarks including folders
      const processBookmarks = (nodes) => {
        return nodes.reduce((acc, node) => {
          if (node.children) {
            // If it's a folder, include it with its children
            acc.push({
              ...node,
              children: processBookmarks(node.children)
            });
          } else {
            // If it's a bookmark, just include it
            acc.push(node);
          }
          return acc;
        }, []);
      };

      const allBookmarks = processBookmarks(tree[0].children);
      setBookmarks(allBookmarks);
      setLoading(false);
    });
  };

  const filterBookmarks = (nodes, term) => {
    if (!term) return nodes;

    return nodes.reduce((filtered, node) => {
      if (node.title?.toLowerCase().includes(term.toLowerCase()) ||
          node.url?.toLowerCase().includes(term.toLowerCase())) {
        filtered.push(node);
      } else if (node.children) {
        const filteredChildren = filterBookmarks(node.children, term);
        if (filteredChildren.length) {
          filtered.push({
            ...node,
            children: filteredChildren
          });
        }
      }
      return filtered;
    }, []);
  };

  const displayedBookmarks = filterBookmarks(bookmarks, searchTerm);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">Loading bookmarks...</div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto hide-scrollbar">
      {displayedBookmarks.map((bookmark) => (
        <BookmarkItem 
          key={bookmark.id} 
          bookmark={bookmark}
        />
      ))}
      {displayedBookmarks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No bookmarks found' : 'No bookmarks'}
        </div>
      )}
    </div>
  );
};

export default BookmarksList;