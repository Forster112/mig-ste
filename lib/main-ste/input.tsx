import React, { useState } from 'react';

export interface TextEditorProps {
  handleContentChange?: (content: string) => void;
  id?: string;
  ref?: React.RefObject<HTMLDivElement>;
  placeholder?: string;
  editorClass?: string;
  activeColor?: string;
  buttonWrapClass?: string;
  buttonsClass?: string;
  formats?: string[];
}

const styles = [
  { tag: 'b', label: 'bold', icon: <b>B</b> },
  { tag: 'i', label: 'italic', icon: <i>I</i> },
  { tag: 's', label: 'strikethrough', icon: <s>S</s> },
  { tag: 'u', label: 'underline', icon: <u>U</u> },
  { tag: 'a', label: 'link', icon: <span>🔗</span> },
  {
    tag: 'code',
    label: 'code',
    icon: <span>{'</>'}</span>,
  },
  {
    tag: 'li',
    label: 'list',
    icon: (
      <span className="list">
        •− <br /> •−{' '}
      </span>
    ),
  },
];

export const Input: React.FC<TextEditorProps> = ({
  handleContentChange = () => {},
  id,
  ref,
  placeholder,
  editorClass,
  activeColor,
  buttonWrapClass,
  buttonsClass,
  formats,
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

  const chosenFormats = styles.filter((style) => {
    return formats?.includes(style.label);
  })

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

    if (
      tag === 'a' &&
      parentElement?.tagName !== 'A' &&
      !attribute &&
      !value
    ) {
      console.log(parentElement?.tagName !== 'A');
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
        
        const tags = chosenFormats.map(
          (style) => style.tag
        );
        if (tags.includes(tagName)) {
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
      target.classList.remove('placeholderClass');
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLDivElement>
  ) => {
    const target = e.target as HTMLDivElement;
    if (!target.textContent) {
      target.textContent =
        placeholder || 'Start typing here...';
      target.classList.add('placeholderClass');
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
          {chosenFormats.map((style) => (
            <button
              key={style.tag}
              onClick={() => toggleStyle(style.tag)}
              className={`${buttonsClass || ''} buttons`}
              style={{
                backgroundColor: activeStyles.includes(
                  style.tag
                )
                  ? activeColor || '#606263'
                  : 'transparent',
              }}
            >
              {style.icon}
            </button>
          ))}
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
        className={`${
          editorClass || ''
        } placeholderClass editor`}
        data-placeholder={
          placeholder || 'Start typing here...'
        }
      >
        {placeholder || 'Start typing here...'}
      </div>
    </div>
  );
};
