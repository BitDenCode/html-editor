// src/components/Toolbar.tsx
import React from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, CodeSquare, Quote,
  RemoveFormatting, Link, Undo, Redo, Table, Video, Images, X,
} from 'lucide-react';
import './Toolbar.css';
import ColorPicker from './ColorPicker';

interface Props {
  onStyleClick: (style: string) => void;
  onColorSelect: (color: string) => void;
  onUndoClick?: () => void;
  onRedoClick?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  currentColor?: string;
  currentInlineStyle: Set<string>;
  currentBlockType: string;

  // ↓ Добавь эти строки:
  onInsertImage: () => void;
  onInsertLink: () => void;
  onRemoveLink: () => void;
  onInsertIframe: () => void;
  onClearStyles: () => void;
}

const Toolbar: React.FC<Props> = ({
  onStyleClick,
  onColorSelect,
  onUndoClick,
  onRedoClick,
  canUndo = true,
  canRedo = true,
  currentColor,
  currentInlineStyle,
  currentBlockType,

  // 👇 Добавь эти пропсы
  onInsertImage,
  onInsertLink,
  onRemoveLink,
  onInsertIframe,
  onClearStyles,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          onClick={onUndoClick}
          disabled={!canUndo}
          title="Отменить действие"
        >
          <Undo size={18} strokeWidth={2} />
        </button>
        <button
          onClick={onRedoClick}
          disabled={!canRedo}
          title="Повторить действие"
        >
          <Redo size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button
          onClick={() => onStyleClick('BOLD')}
          title="Жирный"
          className={currentInlineStyle.has('BOLD') ? 'active' : ''}
        >
          <Bold size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('ITALIC')}
          title="Курсив"
          className={currentInlineStyle.has('ITALIC') ? 'active' : ''}
        >
          <Italic size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('UNDERLINE')}
          title="Подчёркнутый"
          className={currentInlineStyle.has('UNDERLINE') ? 'active' : ''}
        >
          <Underline size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('STRIKETHROUGH')}
          title="Зачёркнутый"
          className={currentInlineStyle.has('STRIKETHROUGH') ? 'active' : ''}
        >
          <Strikethrough size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('CODE')}
          title="Встроенный Code"
          className={currentInlineStyle.has('CODE') ? 'active' : ''}
        >
          <Code size={18} strokeWidth={2} />
        </button>
        <ColorPicker
          onColorSelect={onColorSelect}
          currentColor={currentColor}
        />
      </div>

      <div className="toolbar-group">
        <button
          onClick={() => onStyleClick('header-one')}
          title="Заголовок 1"
          className={currentBlockType === 'header-one' ? 'active' : ''}
        >
          <Heading1 size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('header-two')}
          title="Заголовок 2"
          className={currentBlockType === 'header-two' ? 'active' : ''}
        >
          <Heading2 size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('header-three')}
          title="Заголовок 3"
          className={currentBlockType === 'header-three' ? 'active' : ''}
        >
          <Heading3 size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          onClick={() => onStyleClick('unordered-list-item')}
          title="Маркированный список"
          className={currentBlockType === 'unordered-list-item' ? 'active' : ''}
        >
          <List size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('ordered-list-item')}
          title="Нумерованный список"
          className={currentBlockType === 'ordered-list-item' ? 'active' : ''}
        >
          <ListOrdered size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('blockquote')}
          title="Цитата"
          className={currentBlockType === 'blockquote' ? 'active' : ''}
        >
          <Quote size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('code-block')}
          title="Code Block"
          className={currentBlockType === 'code-block' ? 'active' : ''}
        >
          <CodeSquare size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          onClick={() => onStyleClick('link')}
          title="Вставить ссылку"
        >
          <Link size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('table')}
          title="Вставить таблицу"
        >
          <Table size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => onStyleClick('clear')}
          title="Очистить форматирование"
        >
          <RemoveFormatting size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="toolbar-group">

        <button onClick={onInsertImage} title="Вставить изображение">
          <Images size={18} strokeWidth={2} />
        </button>
        <button onClick={onInsertIframe} title="Вставить видео">
          <Video size={18} strokeWidth={2} />
        </button>
        <button onClick={onClearStyles} title="Удалить все стили">
          <X size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
