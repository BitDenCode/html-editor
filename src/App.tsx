import React, { useState } from 'react';
import './styles/cyberpunk.css';
import EditorComponent from './components/Editor';
import HtmlOutput from './components/HtmlOutput';
import {
  Save, 
  PencilRuler,
  MonitorCog,
} from 'lucide-react';

const App: React.FC = () => {
  const [html, setHtml] = useState<string>('');

  return (
    <div className="app-container">
      <h1 className="title">Визуальный HTML Редактор</h1>      
      <p>Редактор предназначен для визуального редактирования HTML-контента без необходимости писать код вручную.</p>
      <p>Вы можете легко форматировать текст, вставлять <strong>ссылки</strong>, <strong>изображения</strong> и <strong>видео</strong>, использовать заголовки, списки, цитаты и другие элементы оформления.
      Результат отображается в режиме <strong>живого предпросмотра HTML</strong>, что удобно для последующего копирования и вставки в ваш сайт или CMS.</p>

      <div className="editor-wrapper">
        <EditorComponent setHtml={setHtml} />
        <HtmlOutput html={html} />
      </div>

      <div className="app-container">
        <h4><PencilRuler size={18} strokeWidth={2} /> Возможности:</h4>
        <ul>
          <li><strong>Форматирование текста:</strong> жирный, курсив, подчёркнутый, зачёркнутый</li>
          <li><strong>Заголовки:</strong> H1, H2, H3</li>
          <li><strong>Списки:</strong> маркированные и нумерованные</li>
          <li><strong>Цитаты и код:</strong> цитата, блочный и строчный код</li>
          <li><strong>Таблицы:</strong> вставка и редактирование таблиц</li>
          <li><strong>Медиа:</strong> изображения (с URL), видео iframe</li>
          <li><strong>Ссылки:</strong> вставка и удаление</li>
          <li><strong>Цвет текста:</strong> выбор из палитры</li>
          <li><strong>Отмена/повтор действий:</strong> Undo / Redo</li>
          <li><strong>Очистка стилей:</strong> удаление форматирования и HTML-мусора</li>
        </ul>
        <h4><MonitorCog size={18} strokeWidth={2} /> Интерфейс:</h4>
        <ul>
          <li>Панель инструментов с иконками и подсказками</li>
          <li>Область редактирования текста</li>
          <li>Блок «живого» HTML-просмотра (опционально)</li>          
        </ul>
        <h4><Save size={18} strokeWidth={2} /> Экспорт:</h4>
        <p>Генерация чистого HTML, готового для вставки в:</p>
        <ul>
          <li>CMS (Bitrix, WordPress, Tilda, Webflow и др.)</li>
          <li>email-рассылки</li>
          <li>лендинги</li>
          <li>внутренние порталы и wiki-документы</li>
        </ul>
      </div>

    </div>
  );
};

export default App;
