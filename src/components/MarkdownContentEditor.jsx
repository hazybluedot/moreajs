import React, {useEffect, useState} from "react";

import { Editor, EditorState, RichUtils } from "md-draft-js";
import "./editor.css";

const MarkdownContentEditor = ({content, saveContent}) => {
    const [editorState, setEditorState] = useState(EditorState.createWithContent(content));
    const [isTyping, setIsTyping] = useState(false);
        
    useEffect(() => {
        if (editorState && editorState.text) {
            console.log('MarkdownContentEditor saving content', editorState.text);
            saveContent(editorState.text);
        }
    }, [editorState]);

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
          <Editor autoFocus
                  className="editor-textarea"
                  editorState={editorState}
		  onKeyCommand={handleKeyCommand}
                  spellCheck={true}
	          onChange={setEditorState} />
        </div>
    );
};

export default MarkdownContentEditor;

