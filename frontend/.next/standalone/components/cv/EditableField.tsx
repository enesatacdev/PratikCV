import React, { useState, useRef, useEffect } from 'react';
import { Edit3 } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  fieldName?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  className = '',
  placeholder = 'Tıklayarak düzenleyin...',
  multiline = false,
  fieldName = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        const textarea = inputRef.current as HTMLTextAreaElement;
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      } else {
        const input = inputRef.current as HTMLInputElement;
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }, [isEditing, multiline]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${className} min-h-[60px] resize-none border border-blue-300 rounded-md p-3 focus:outline-none focus:border-blue-500 bg-white shadow-sm`}
            placeholder={placeholder}
            rows={3}
            style={{ 
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              color: 'inherit'
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`${className} border border-blue-300 rounded-md p-2 focus:outline-none focus:border-blue-500 bg-white shadow-sm`}
            placeholder={placeholder}
            style={{ 
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              color: 'inherit'
            }}
          />
        )}
        <div className="text-xs text-gray-500 mt-1 bg-white px-2 py-1 rounded shadow-sm border">
          {multiline ? 'Ctrl+Enter: Kaydet' : 'Enter: Kaydet'} • Esc: İptal
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} relative cursor-pointer transition-all duration-200 ${
        isHovered ? 'bg-blue-50 rounded-md' : ''
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value || (
        <span className="text-gray-400 italic">{placeholder}</span>
      )}
      {isHovered && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2">
          <div className="bg-blue-500 text-white rounded-full p-1 shadow-lg">
            <Edit3 size={12} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableField;
