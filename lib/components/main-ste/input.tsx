import React, { useState } from 'react';

interface TextEditorProps {
  handleContentChange: (content: string) => void;
  id?: string;
  ref?: React.RefObject<HTMLDivElement>;
  placeholder?: string;
  editorClass?: string;
  activeColor?: string;
  buttonWrapClass?: string;
  buttonsClass?: string;
}

export const Input: React.FC<TextEditorProps> = ({
  handleContentChange = () => { },
  id,
  ref,
  placeholder,
  editorClass,
  activeColor,
  buttonWrapClass,
  buttonsClass
}) => {
  const [showStylesContainer, setShowStylesContainer] =
    useState<boolean>(false);
  const [activeStyles, setActiveStyles] = useState<
    string[]
  >([]);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  // Function that toggles the style of the selected text
  const toggleStyle = (
    tag: string,
    attribute?: string,
    value?: string
  ) => {
    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      selection.isCollapsed
    )
      return;

    const range = selection.getRangeAt(0);

    const parentElement =
      range.commonAncestorContainer.nodeType ===
      Node.ELEMENT_NODE
        ? (range.commonAncestorContainer as HTMLElement)
        : range.commonAncestorContainer.parentElement;

    if (
      parentElement &&
      parentElement.tagName === tag.toUpperCase()
    ) {
      const parent = parentElement.parentNode!;
      while (parentElement.firstChild) {
        parent.insertBefore(
          parentElement.firstChild,
          parentElement
        );
      }
      parent.removeChild(parentElement);
      setActiveStyles(
        activeStyles.filter((style) => style !== tag)
      );
      return;
    }

    if (tag === 'a') {
      addLink();
      return;
    }

    const selectedText = range.extractContents();

    const styledElement = document.createElement(tag);
    if (attribute && value) {
      styledElement.setAttribute(attribute, value);
    }
    styledElement.appendChild(selectedText);
    range.deleteContents();
    range.insertNode(styledElement);

    const newRange = document.createRange();
    newRange.setStartAfter(styledElement);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  // This function is called when the user selects text and makes the styles container visible
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      selection.isCollapsed
    ) {
      setShowStylesContainer(false);
      setActiveStyles([]);
      return;
    }

    setShowStylesContainer(true);

    const range = selection.getRangeAt(0);

    const rect = range.getBoundingClientRect();

    setPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });

    // show styles of the selected text
    const parentElement =
      range.commonAncestorContainer.nodeType ===
      Node.ELEMENT_NODE
        ? (range.commonAncestorContainer as HTMLElement)
        : range.commonAncestorContainer.parentElement;

    const activeTags: string[] = [];
    if (parentElement) {
      let currentElement: HTMLElement | null =
        parentElement as HTMLElement;
      while (
        currentElement &&
        currentElement !== document.body
      ) {
        const tagName =
          currentElement.tagName.toLowerCase();
        if (['b', 'i', 'a'].includes(tagName)) {
          activeTags.push(tagName);
        }
        currentElement = currentElement.parentElement;
      }
    }
    setActiveStyles(activeTags);
  };

  const addLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      toggleStyle('a', 'href', url);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLDivElement>
  ) => {
    handleContentChange(e.target.innerHTML);
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLDivElement>
  ) => {
    const target = e.target as HTMLDivElement;
    if (
      target.textContent === 'Start typing here...' ||
      target.textContent === placeholder
    ) {
      target.textContent = '';
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLDivElement>
  ) => {
    const target = e.target as HTMLDivElement;
    if (!target.textContent) {
      target.textContent =
        placeholder || 'Start typing here...';
    }
  };

  return (
    <div>
      {showStylesContainer && (
        <div
          className={`${buttonWrapClass || ''} buttonsWrap`}
          style={{
            top: position.top + 20,
            left: position.left,
          }}
        >
          <button
            onClick={() => toggleStyle('b')}
            className={`${buttonsClass || ''} buttons`}
            style={{
              backgroundColor: activeStyles.includes('b')
                ? activeColor || '#606263'
                : 'transparent',
            }}
          >
            <b>B</b>
          </button>
          <button
            onClick={() => toggleStyle('i')}
            className={`${buttonsClass || ''} buttons`}
            style={{
              backgroundColor: activeStyles.includes('i')
                ? activeColor || '#606263'
                : 'transparent',
            }}
          >
            <i>I</i>
          </button>
          <button
            onClick={() => toggleStyle('a')}
            className={`${buttonsClass || ''} buttons`}
            style={{
              backgroundColor: activeStyles.includes('a')
                ? activeColor || '#606263'
                : 'transparent',
            }}
          >
            🔗
          </button>
        </div>
      )}
      <div
        id={id}
        ref={ref}
        contentEditable={true}
        suppressContentEditableWarning
        onInput={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSelect={handleTextSelection}
        className={`${editorClass || ''} editor`}
        data-placeholder={
          placeholder || 'Start typing here...'
        }
      >
        {placeholder || 'Start typing here...'}
      </div>
    </div>
  );
};
