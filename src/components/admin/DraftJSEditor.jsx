import React, {useEffect, useState} from "react";
import { debounce } from "throttle-debounce";

import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from "draft-js";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
import "draft-js/dist/Draft.css";

const MarkdownContentEditor = ({content, saveContent}) => {
    const rawData = markdownToDraft(content);
    const contentState = convertFromRaw(rawData);
    console.log('rawData', rawData, 'contentState', contentState);
    const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));

    const debouncedValue = useDebounce(editorState, 1000);

    useEffect(() => {
	if (debouncedValue !== content) {
	    //console.log('saving content to server', debouncedValue);
	    saveContent(draftToMarkdown(convertToRaw(debouncedValue.getCurrentContent())));
	}   
    }, [debouncedValue]);
    
    const handleKeyCommand = (command, editorState) => {
	const newState = RichUtils.handleKeyCommand(editorState, command);
	if (newState) {
	    setEditorState(editorState);
	    return "handled";
	}

	return "not-handled";
    };

    const onLinkClick = (...stuff) => {
        console.log('onLinkClick', stuff);
    };
    
    const onImageClick = (...stuff) => {
        console.log('onImageClick', stuff);
    };

    return (
        <div className="editor">
          <div className="editor-buttons">
                      <button
                        className="editor-action"
                        onClick={onLinkClick}
        aria-label="Link"
                      >
                        <span className="glyphicon glyphicon-link" aria-hidden="true" />
                      </button>
            <button
              className="editor-action"
              onClick={onImageClick}
              aria-label="Image"
            >
              <span className="glyphicon glyphicon-picture" aria-hidden="true" />
            </button>
          </div>
          <Editor editorState={editorState}
		  handleKeyCommand={handleKeyCommand}
                  spellCheck={true}
	          onChange={setEditorState} />
        </div>
    );
};

export default MarkdownContentEditor;

// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(

    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.

      return () => {
        clearTimeout(handler);
      };
    },

    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
