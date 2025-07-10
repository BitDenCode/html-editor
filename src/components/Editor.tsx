
// src/components/Editor.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  AtomicBlockUtils,
  Modifier,
  CompositeDecorator,
  ContentState,
  ContentBlock,
} from 'draft-js';
import { Youtube, Camera, CircleOff, Files, } from 'lucide-react';
import 'draft-js/dist/Draft.css';
import Toolbar from './Toolbar';
import TableBlock from './TableBlock';
import { stateToHTML } from 'draft-js-export-html';
import './Editor.css';

interface Props {
  setHtml: (html: string) => void;
}

// Карта цветов для стилей
const colorStyleMap: { [key: string]: React.CSSProperties } = {};

const findLinkEntities = (contentBlock: ContentBlock, callback: any, contentState: ContentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
};

const Link = (props: any) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#0ff' }}>
      {props.children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);



const EditorComponent: React.FC<Props> = ({ setHtml }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );
  const [description, setDescription] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [currentColor, setCurrentColor] = useState<string>('');
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState, {
      inlineStyles: {
        ...Object.keys(colorStyleMap).reduce((acc, styleKey) => ({
          ...acc,
          [styleKey]: { style: colorStyleMap[styleKey] }
        }), {}),
        CODE: { 
          element: 'code',
          style: {
            backgroundColor: '#f0f0f0',
            padding: '2px 4px',
            borderRadius: '3px',
            fontFamily: 'monospace'
          }
        },
        STRIKETHROUGH: { 
          style: { textDecoration: 'line-through' } 
        }
      },
      blockStyleFn: (block) => {
        const type = block.getType();
        if (type === 'code-block') {
          return {
            element: 'pre',
            wrapper: <code />,
          };
        }
      },
      entityStyleFn: (entity) => {
        const type = entity.getType().toLowerCase();
        const data = entity.getData();

        if (type === 'image') {
          return {
            element: 'img',
            attributes: {
              src: data.src,
              alt: data.alt || '',
            },
            style: {
              maxWidth: '100%',
              display: 'block',
              margin: '1rem auto',
            },
          };
        }

        if (type === 'iframe') {
          return {
            element: 'iframe',
            attributes: {
              src: data.src,
              width: '100%',
              height: '315',
              frameBorder: '0',
              allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
              allowFullScreen: true,
            },
          };
        }

        if (type === 'table') {
          return {
            element: 'table',
            attributes: {
              style: 'border-collapse: collapse; width: 100%;',
              innerHTML: `<tbody>${
                data.cells.map((row: string[]) => 
                  `<tr>${row.map((cell: string) => 
                    `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`
                  ).join('')}</tr>`
                ).join('')
              }</tbody>`
            }
          };
        }

        return undefined;
      },
    });

    setHtml(html);
    setHtmlOutput(html);
  }, [editorState, setHtml]);

  const handleKeyCommand = useCallback((command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }, []);

  // Обработка выбора цвета
  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
    
    if (!color) {
      // Удаляем все цветовые стили
      const selection = editorState.getSelection();
      const currentContent = editorState.getCurrentContent();
      
      let nextContentState = currentContent;
      Object.keys(colorStyleMap).forEach(style => {
        nextContentState = Modifier.removeInlineStyle(
          nextContentState,
          selection,
          style
        );
      });
      
      setEditorState(EditorState.push(editorState, nextContentState, 'change-inline-style'));
    } else {
      const styleKey = `COLOR-${color.replace('#', '')}`;
      
      // Добавляем стиль в карту если его еще нет
      if (!colorStyleMap[styleKey]) {
        colorStyleMap[styleKey] = { color };
      }
      
      // Применяем стиль
      const selection = editorState.getSelection();
      const currentContent = editorState.getCurrentContent();
      
      // Сначала удаляем все другие цветовые стили
      let nextContentState = currentContent;
      Object.keys(colorStyleMap).forEach(style => {
        if (style !== styleKey) {
          nextContentState = Modifier.removeInlineStyle(
            nextContentState,
            selection,
            style
          );
        }
      });
      
      // Затем применяем новый цвет
      nextContentState = Modifier.applyInlineStyle(
        nextContentState,
        selection,
        styleKey
      );
      
      setEditorState(EditorState.push(editorState, nextContentState, 'change-inline-style'));
    }
  };

  const applyStyle = (style: string) => {
    const blockStyles = [
      'header-one',
      'header-two',
      'header-three',
      'unordered-list-item',
      'ordered-list-item',
      'blockquote',
      'code-block',
    ];

    if (style === 'table') {
      // Создаем таблицу
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'TABLE',
        'IMMUTABLE',
        {
          rows: 3,
          cols: 3,
          cells: Array(3).fill(null).map(() => Array(3).fill(''))
        }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { 
        currentContent: contentStateWithEntity 
      });
      
      setEditorState(
        AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
      );
    } else if (style === 'clear') {
      // Очистка форматирования
      const selection = editorState.getSelection();
      let currentContent = editorState.getCurrentContent();
      
      // Удаляем все инлайн стили
      const stylesToRemove = ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH', 'CODE'];
      stylesToRemove.forEach(s => {
        currentContent = Modifier.removeInlineStyle(currentContent, selection, s);
      });
      
      // Удаляем все цветовые стили
      Object.keys(colorStyleMap).forEach(s => {
        currentContent = Modifier.removeInlineStyle(currentContent, selection, s);
      });
      
      setEditorState(EditorState.push(editorState, currentContent, 'change-inline-style'));
      setCurrentColor('');
    } else if (style === 'link') {
      insertLink();
    } else if (blockStyles.includes(style)) {
      setEditorState(RichUtils.toggleBlockType(editorState, style));
    } else {
      setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    }
  };

  const handleUndo = () => {
    setEditorState(EditorState.undo(editorState));
  };

  const handleRedo = () => {
    setEditorState(EditorState.redo(editorState));
  };

  const insertImage = () => {
    const url = prompt('Введите ссылку на изображение:');
    if (!url) return;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: url });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
  };

  const insertLink = () => {
    const url = prompt('Введите URL для ссылки:');
    if (!url) return;

    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      alert('Выделите текст для создания ссылки.');
      return;
    }

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const contentWithLink = Modifier.applyEntity(contentStateWithEntity, selection, entityKey);
    const newEditorState = EditorState.push(editorState, contentWithLink, 'apply-entity');

    setEditorState(newEditorState);
  };

  const removeLink = () => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) return;

    const contentState = editorState.getCurrentContent();
    const contentWithoutLink = Modifier.applyEntity(contentState, selection, null);
    const newEditorState = EditorState.push(editorState, contentWithoutLink, 'apply-entity');

    setEditorState(newEditorState);
  };

  const insertIframe = () => {
    const url = prompt('Введите ссылку на видео (YouTube или др.):');
    if (!url) return;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IFRAME', 'IMMUTABLE', { src: url });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
  };

  const blockRendererFn = (block: ContentBlock) => {
    if (block.getType() === 'atomic') {
      const contentState = editorState.getCurrentContent();
      const entityKey = block.getEntityAt(0);
      const entity = entityKey ? contentState.getEntity(entityKey) : null;

      if (!entity) return null;

      const type = entity.getType();
      const data = entity.getData();

      if (type === 'IMAGE') {
        return {
          component: () => (
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <img src={data.src} alt="" style={{ maxWidth: '100%' }} />
            </div>
          ),
          editable: false,
        };
      }

      if (type === 'IFRAME') {
        return {
          component: () => (
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <iframe
                src={data.src}
                width="100%"
                height="315"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="embedded-video"
              ></iframe>
            </div>
          ),
          editable: false,
        };
      }

      if (type === 'TABLE') {
        return {
          component: TableBlock,
          editable: false,
          props: {
            data: data,
            onUpdate: (newData: any) => {
              const newContentState = editorState.getCurrentContent().mergeEntityData(
                entityKey,
                { ...newData }
              );
              setEditorState(EditorState.push(editorState, newContentState, 'apply-entity'));
            },
            onRemove: () => {
              const selection = editorState.getSelection();
              const newContentState = Modifier.removeRange(
                editorState.getCurrentContent(),
                selection.merge({
                  anchorKey: block.getKey(),
                  focusKey: block.getKey(),
                  anchorOffset: 0,
                  focusOffset: block.getLength(),
                }),
                'backward'
              );
              setEditorState(EditorState.push(editorState, newContentState, 'remove-range'));
            }
          }
        };
      }
    }

    return null;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(htmlOutput);
      alert('HTML скопирован в буфер обмена!');
    } catch (err) {
      alert('Ошибка копирования.');
    }
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  // Объединяем стандартные стили с цветовыми
  const customStyleMap = {
    ...colorStyleMap,
    CODE: {
      backgroundColor: '#f0f0f0',
      fontFamily: 'monospace',
      padding: '2px 4px',
      borderRadius: '3px',
      color: '#333'
    },
    STRIKETHROUGH: {
      textDecoration: 'line-through'
    }
  };

  const getCurrentBlockType = (editorState: EditorState): string => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    return block.getType();
  };

  return (
    <div className="editor-block">
      <Toolbar 
        onStyleClick={applyStyle}
        onColorSelect={handleColorSelect}
        onUndoClick={handleUndo}
        onRedoClick={handleRedo}
        canUndo={editorState.getUndoStack().size > 0}
        canRedo={editorState.getRedoStack().size > 0}
        currentColor={currentColor}

        currentInlineStyle={new Set(editorState.getCurrentInlineStyle().toArray())}
        currentBlockType={getCurrentBlockType(editorState)}

        onInsertImage={insertImage}
        onInsertLink={insertLink}
        onRemoveLink={removeLink}
        onInsertIframe={insertIframe}
        onClearStyles={() => applyStyle('clear')}
      />


      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button 
          onClick={insertImage}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#d7d7d7',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        ><Camera size={18} strokeWidth={2} /> Вставить изображение</button>
        <button 
          onClick={removeLink}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#d7d7d7',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        ><CircleOff size={18} strokeWidth={2} /> Удалить ссылку</button>
        <button 
          onClick={insertIframe}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#d7d7d7',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        ><Youtube size={18} strokeWidth={2} /> Вставить видео</button>
      </div>

      <div
        className="editor-container"
        onClick={focusEditor}
        style={{
          border: '1px solid #333',
          padding: '1rem',
          minHeight: '200px',
          backgroundColor: '#1e1e1e',
          color: '#eee',
          borderRadius: '4px',
          cursor: 'text',
        }}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          blockRendererFn={blockRendererFn}
          customStyleMap={customStyleMap}
          placeholder="Начни вводить текст..."
        />
      </div>

      <div className="description-section" style={{ marginTop: '1rem' }}>
        <label htmlFor="description">Заметки:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Введите заметки для блока..."
          style={{
            width: '100%',
            padding: '0.5rem',
            marginTop: '0.5rem',
            backgroundColor: '#1e1e1e',
            color: '#ccc',
            border: '1px solid #333',
            borderRadius: '4px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        onClick={copyToClipboard}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#d7d7d7',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        <Files size={18} strokeWidth={2} /> Скопировать HTML
      </button>


      
      <div className="editor-preview">
        <div className="editor-pre">       
          <h4>Предпросмотр:</h4>
        </div> 
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{
            __html: stateToHTML(editorState.getCurrentContent()),
          }}
        />
      </div>
    </div>
  );
};

export default EditorComponent;