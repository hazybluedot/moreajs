import React, {useEffect, useState} from "react";
import { debounce } from "throttle-debounce";

import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

const MarkdownContentEditor = ({content, saveContent}) => {
    const [value, setValue] = useState(content);
    const [selectedTab, setSelectedTab] = useState("write");

    const debouncedValue = useDebounce(value, 1000);

    useEffect(() => {
	if (debouncedValue !== content) {
	    //console.log('saving content to server', debouncedValue);
	    saveContent(debouncedValue);
	}   
    }, [debouncedValue]);
    
    useEffect(() => {
	if (content !== value) {
	    setValue(content);
	}
    }, [content]);
    
    return (
	<ReactMde value={value}
		  onChange={setValue}
		  selectedTab={selectedTab}
		  onTabChange={setSelectedTab}
		  generateMarkdownPreview={markdown =>
					   Promise.resolve(splitRender(markdown))
					   }
					   />
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
